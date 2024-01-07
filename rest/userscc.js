const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../util/validators");

const { SECRET_KEY } = require("../config");
const User = require("../models/User");

const router = express.Router();
router.use(express.json());
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}
//changes 
// Login Endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const { errors, valid } = validateLoginInput(username, password);

  if (!valid) {
    return res.status(400).json({ errors });
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      errors.general = "User not found";
      return res.status(404).json({ errors });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      errors.general = "Wrong credentials";
      return res.status(400).json({ errors });
    }

    const token = generateToken(user);

    return res.status(200).json({
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

// Register Endpoint
router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  const { valid, errors } = validateRegisterInput(
    username,
    email,
    password,
    confirmPassword
  );

  if (!valid) {
    return res.status(400).json({ errors });
  }

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      throw new UserInputError("Username is taken", {
        errors: {
          username: "This username is taken",
        },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    const savedUser = await newUser.save();

    const token = generateToken(savedUser);

    return res.status(201).json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;
