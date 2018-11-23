const User = require('../../models/user-model');
const createAuthToken = require('../../utils/token');

module.exports = async (root, args) => {
  const { email, password } = args;
  const user = await User.findOne({ email });
  if (!user) throw ('Invalid credentials');
  const isValid = await user.validatePassword(password);
  if (!isValid) throw ('Invalid credentials');
  return createAuthToken(user.serialize());
};