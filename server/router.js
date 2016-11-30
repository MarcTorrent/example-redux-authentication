const Authentication = require('./controllers/authentication'),
  passportService = require('./services/passport'),
  passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false}),
  requireSignin = passport.authenticate('local', {session: false});

module.exports = function(app) {
  app.get('/', requireAuth, function(req, res) {
    res.send({message: 'Super secret code is ABC123'});
  });
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
