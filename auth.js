// check of there is user by email entered
// decrypt pwd and match that in DB
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = mongoose.model("User");

exports.authenticate = (email, password) => {
  return new Promise(async (resolve, reject) => {
    // when promise done doing what we want
    // want to return something from it call resolve and pass something in
    try {
      // get user by email
      const user = await User.findOne({ email });

      // match pwd
      bcrypt.compare(password, user.password, (err, isMatch) => {
        // if pwd match -isMatch = true
        if (err) throw err;
        if (isMatch) {
          resolve(user);
        } else {
          // pwd did not match
          reject("Authentification failed");
        }
      });
    } catch (err) {
      // email not fund
      reject("Authentification failed");
    }
  });
};
