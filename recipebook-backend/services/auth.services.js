const jwt = require('jsonwebtoken');

class AuthService {
    verifyToken(req, res, next) {
        const bearerHeader = req.headers.authorization;
        if(bearerHeader) {
          let bearer = bearerHeader.split(' ');
          let token = bearer[1];
          req.token = token;
          jwt.verify(token, process.env.SECRET_KEY, (error, tokenData) => {
            if(error) {
              res.sendStatus(403);
            }
            else {
              req.username = tokenData.username;
              next();
            }
          });
        }
        else {
          res.sendStatus(403);
        }
    }
}


module.exports = new AuthService();