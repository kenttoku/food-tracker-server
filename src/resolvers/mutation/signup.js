const User = require('../../models/user-model');
const createAuthToken = require('../../utils/token');

module.exports = async (root, args) => {
  const { email, password } = args;
  const hashedPassword = await User.hashPassword(password);
  const user = await User.create({ email, password: hashedPassword });
  const authToken = createAuthToken(user.serialize());
  return authToken;
};