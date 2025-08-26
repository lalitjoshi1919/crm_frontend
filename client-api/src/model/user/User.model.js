// src/model/user/User.model.js
const { User } = require("./User.schema");

const insertUser = async (userObj) => {
  const user = new User(userObj);
  return await user.save();
};

const getUserByEmail = async (email) => {
  if (!email) return null;
  return await User.findOne({ email });
};

const getUserById = async (_id) => {
  if (!_id) return null;
  return await User.findOne({ _id });
};

const storeUserRefreshJWT = async (_id, token) => {
  return await User.findOneAndUpdate(
    { _id },
    { $set: { "refreshJWT.token": token, "refreshJWT.addedAt": Date.now() } },
    { new: true }
  );
};

const updatePassword = async (email, newhashedPass) => {
  return await User.findOneAndUpdate(
    { email },
    { $set: { password: newhashedPass } },
    { new: true }
  );
};

const verifyUser = async (_id, email) => {
  return await User.findOneAndUpdate(
    { _id, email, isVerified: false },
    { $set: { isVerified: true } },
    { new: true }
  );
};

module.exports = {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
  updatePassword,
  verifyUser,
};
