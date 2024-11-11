// fichier ./middleware/authentification.js
const axios = require('axios');

const saltRounds = 10; // Cost factor for the bcrypt algorithm

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



const authentification = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="mon site à moi", charset="UTF-8"');
        return res.status(401).end(); // Accès refusé
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString();
    const [user, password] = credentials.split(':');

    try {
        // Remplacez l'URL par l'URL de votre API d'authentification
        const response = await axios.post('https://votre-api.com/auth', {
            username: user,
            password: password
        });

        if (response.status === 200) {
            next(); // Authentification réussie, passez au middleware suivant
        } else {
            res.setHeader('WWW-Authenticate', 'Basic realm="mon site à moi", charset="UTF-8"');
            return res.status(401).end(); // Accès refusé
        }
    } catch (error) {
        res.setHeader('WWW-Authenticate', 'Basic realm="mon site à moi", charset="UTF-8"');
        return res.status(401).end(); // Accès refusé
    }
};

module.exports = authentification;