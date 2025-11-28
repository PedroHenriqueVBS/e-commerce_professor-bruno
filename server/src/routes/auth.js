const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "defaultsecret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Credenciais inválidas" });
  }

  const token = jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role
  }, SECRET, { expiresIn: "1d" });

  res.json({ token });
});

router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);
    res.json(user);
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
});

module.exports = router;
