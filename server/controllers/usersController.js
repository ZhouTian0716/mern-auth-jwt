const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// 👻 standard descriptions
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from MongoDB
  const users = await User.find().select("-password").lean();
  // If no users
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// 👻 standard descriptions
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  // Step 1: Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Step 2: Check for duplicate username
  // exec() refer to mongoose doc!
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }
  // Step 3: Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds
  const userObject = { username, password: hashedPwd, roles };
  // Step 4: Create and store new user
  const user = await User.create(userObject);
  // Step 5: Response
  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// 👻 standard descriptions
// Beaware of the update logic, i might want to change it later
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  // Step 1: Confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }
  // Step 2: Does the user exist to update?
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  // Step 3: Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  // Step 4: Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    // Step 5: Hash password
    user.password = await bcrypt.hash(password, 10); // salt rounds
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

// 👻 standard descriptions
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }
  // Does the user still have assigned notes? 😉😉😉
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note?.length) {
    return res.status(400).json({ message: "User has assigned notes" });
  }
  // Does the user exist to delete?
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
