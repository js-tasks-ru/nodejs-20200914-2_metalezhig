const LocalStrategy = require('passport-local').Strategy;

const UserModel = require('../../models/User');

async function verify(email, password, done) {
  try {
    const user = await UserModel.findOne({email});

    if (!user) {
      return done(null, false, 'Нет такого пользователя');
    }

    if (!await user.checkPassword(password)) {
      return done(null, false, 'Неверный пароль');
    }

    done(null, user.toObject());
  } catch (err) {
    done(err);
  }
}

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    verify,
);
