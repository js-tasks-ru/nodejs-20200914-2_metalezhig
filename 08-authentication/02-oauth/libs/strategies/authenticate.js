const UserModel = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    const user = await UserModel.findOne({email});

    if (!user) {
      const newUser = new UserModel({
        email,
        displayName,
      });
      await newUser.validate();
      newUser.save(done);
      return;
    }

    done(null, user.toObject());
  } catch (err) {
    done(err);
  }
};
