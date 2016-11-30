const jwt = require('jwt-simple'),
  User = require('../models/user'),
  config = require('../config');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signup = function(req, res, next) {
  const email = req.body.email,
    password = req.body.password;

  if (!email || !password) {
    res.status(422).send({error: "You must provide an email and a password"});
  }

  // See if a user with the given email exists
  User.findOne({email: email}, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    // If a user with email does exist, return an error
    if (existingUser) {
      return res.status(422).send({error: 'Email is in use'});
    }
    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({token: tokenForUser(user)});
    });
  });
};

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to get them a token
  res.send({token: tokenForUser(req.user)});
}
