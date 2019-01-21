const errors = require("restify-errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const auth = require("../auth");
const jwt = require("jsonwebtoken");
const config = require("../config");

//  register as user

module.exports = server => {
  //  register as user POST
  // http://localhost:3000/register
  server.post("/register", (req, res, next) => {
    // when make req we send email and pwd
    const { email, password } = req.body;

    //   create a new user
    const user = new User({
      email,
      password
    });
    // need to hash pwd with briptjs
    //  give salt to hash pwd with
    bcrypt.genSalt(10, (err, salt) => {
      // take plain txt pwd
      bcrypt.hash(user.password, salt, async (err, hash) => {
        // Hash pwd
        //set pwd not to plain text but to the actual hash
        user.password = hash;
        //  save user
        try {
          const newUser = await user.save();
          res.send(201);
          next();
        } catch (err) {
          return next(new errors.InternalError(err.message));
        }
      });
    });
  });

  //  Auth user

  server.post("/auth", async (req, res, next) => {
    //  when try to authenticate get a email and pwd
    // Pull out these info from req.body
    const { email, password } = req.body;
    try {
      // authenticate user using method created in Auth.js
      const user = await auth.authenticate(email, password);

      //  pass token to authenticate user
      // create token
      const token = jwt.sign(user.toJSON(), config.JWT_SECRET, {
        expiresIn: "15m"
      });

      // retrieve
      const { iat, exp } = jwt.decode(token);
      // response with token
      res.send({ iat, exp, token });

      next();
    } catch (err) {
      // user unauthorized
      return next(new errors.UnauthorizedError(err));
    }
  });
};
