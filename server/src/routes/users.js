const express = require("express");
const User = require("../models/user");
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// LISTAR
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// CRIAR
router.post("/", upload.single("photo"), async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: req.file ? `/uploads/${req.file.filename}` : null,
  });

  res.status(201).json(user);
});

// REMOVER
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Usuário removido" });
});

module.exports = router;
