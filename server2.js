// //////////////////////////////////////////////// //
// Serveur test connexion à rugm, non fonctionnel   //
// //////////////////////////////////////////////// //

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Pour faire des requêtes HTTP vers l'API externe
const rateLimit = require("express-rate-limit");

const app = express();
const port = 8000;
const secretKey = "your_secret_key";

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "ajax.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com", "cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "fonts.gstatic.com", "cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "gravatar.com"],
      frameSrc: ["'self'", "https://www.univ-ubs.fr/fr/index.html", "http://gdscol.ensibs.fr:3000/GdScol/liste_etudiant", "https://www-ensibs.univ-ubs.fr/fr/index.html", "http://gdmi.ensibs.fr:3000/", "http://gdmaq.ensibs.fr:3000/", "http://gdprocint.ensibs.fr:3000/"],
      connectSrc: ["'self'"],
    },
  })
);

app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.xssFilter());

app.use(express.static(__dirname + '/public/'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(csrfProtection);
app.set("view engine", "ejs");

// Middleware d'authentification
function authMiddleware(req, res, next) {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token." });
  }
}

// Route principale
app.get("/", (req, res) => {
  const csrfToken = req.csrfToken();
  res.render("index", { csrfToken });
});

// Endpoint d'authentification
app.post("/api/v1/auth/user-auth", async (req, res) => {
  const { email, password, _csrf } = req.body;

  try {
    // Requête vers l'API d'authentification externe
    const response = await axios.post("https://rugm.ensibs.fr/auth", { email, password });

    // Si l'authentification réussit
    if (response.data && response.data.token) {
      const externalToken = response.data.token;

      // Crée un token JWT local pour la session et l'utilisateur
      const token = jwt.sign({ email: email }, secretKey, { expiresIn: "1h" });

      // Stocke le token dans un cookie
      res.cookie("authToken", token, { httpOnly: true, secure: true });

      // Redirige vers le tableau de bord
      res.sendFile(path.join(__dirname, "./public/dashboard.html"));
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error authenticating:", error);
    res.status(500).json({ message: "Authentication failed." });
  }
});

// Route de déconnexion
app.get("/api/v1/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Successfully logged out" });
});

// Page protégée
app.get("/dashboard", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "./public/dashboard.html"));
});

app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
});
