// (A) INITIALIZE
// (A1) LOAD REQUIRED MODULES
// npm i path express cookie-parser helmet csurf express-rate-limit bcrypt
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const csrf = require("csurf");
const csrfProtection = csrf({ cookie: true });
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10; // Cost factor for the bcrypt algorithm
const rateLimit = require("express-rate-limit");

// (A) EXPRESS 
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
      frameSrc: ["'self'", "http://localhost:3000", "http://localhost:4000", "https://www.univ-ubs.fr/fr/index.html", "http://gdscol.ensibs.fr:3000/GdScol/liste_etudiant", "https://www-ensibs.univ-ubs.fr/fr/index.html", "http://gdmi.ensibs.fr:3000/", "http://gdmaq.ensibs.fr:3000/", "http://gdprocint.ensibs.fr:3000/"],
      connectSrc: ["'self'"],
    },
  })
);

// Enable HSTS
app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true, preload: true }));

// Prevent content type sniffing
app.use(helmet.noSniff());

// Prevent framing of your site
app.use(helmet.frameguard({ action: "sameorigin" }));

// Enable XSS filter
app.use(helmet.xssFilter());

// Serve static files
app.use(express.static(__dirname + '/public/'));


// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Middleware for parsing cookies
app.use(cookieParser());
// Rate limiting to protect against brute force attacks and DoS
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
}));
app.use(csrfProtection);
// Set EJS as a template engine
app.set("view engine", "ejs");


const hashPassword =  (password) => {
  const hash = bcrypt.hashSync(password, saltRounds)
  console.log("hashed password", hash); // return hash
  return hash;
}

const users = [
  {
    email: "example@etud.univ-ubs.fr",
    //password: "password123", // Exemple to do the demo
    password: hashPassword("password123"),
  },
];

const validateUser =  (user, password) => {
  console.log("validating password", password, user.password)
  return bcrypt.compareSync(password,  user.password)
}

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


let Tokensarray = [];
// (B) HOME PAGE - OPEN TO ALL
app.get("/", (req, res) => {
  const csrfToken = req.csrfToken();
  //const csrfToken = generateToken(req, res);
  Tokensarray.push(csrfToken)
  res.render("index", { csrfToken });
});

// (D5) LOGIN ENDPOINT
app.post("/api/v1/auth/user-auth",  (req, res) => {
  const { email, password, _csrf } = req.body;
  //console.log(email);
  //console.log(password);
  //console.log(_csrf);
  const index = Tokensarray.indexOf(_csrf);
  // Verify CSRF token
  if (index < 0) {
    return res.status(403).json({ message: "CSRF token mismatch" });
  }
  //Remove the used token from our array
  Tokensarray = Tokensarray.filter(it => it != _csrf);
  //console.log(Tokensarray)
  console.log("searching email", email);
  // Find the user by matching the provided email
  const user = users.find((u) => u.email === email);
  console.log("password validation");
  // check if the user email and password are correct
  if (user  && validateUser(user, password)) {
    console.log("user found and password ok");
    // Set the token as cookie
    const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: "1h" });
    res.cookie("authToken", token, { httpOnly: true, secure: true });
    // serve the dashboard page
    res.sendFile(path.join(__dirname, "./public/dashboard.html"));
    return;
  }
  res.status(401).json({ message: "Invalid credentials" });
});

app.get("/api/v1/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Successfully logged out" });
});

app.get("/dashboard", authMiddleware, (req, res) => {
  // Render the dashboard page
  // res.render("dashboard");
  res.sendFile(path.join(__dirname, "./public/dashboard.html"));
});


app.listen(port, () => {
  console.log(`Server is running on : http://localhost:${port}`);
})
