const jwt = require('jsonwebtoken');

class AuthService {
    verifyToken(req, res, next) {
        const token = req.cookies.accessToken;
        if(token) {
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

    signToken(username) {
      return jwt.sign({username: username}, process.env.SECRET_KEY);
    }
}


module.exports = new AuthService();