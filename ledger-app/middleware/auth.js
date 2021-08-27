const jwt = require('jsonwebtoken');
const config = require('config');



function auth(req, res, next) {//I used this middleware for ledgers api
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Acess Denied .No token provided');


    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        next();
    }
    catch (ex) {
        res.status(400).send('Invalid token.')
    }
}


module.exports = auth;