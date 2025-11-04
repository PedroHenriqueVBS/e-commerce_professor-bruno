const express = require('express');
const multer = require('multer');

const router = express.Router();

// Configuração do upload (salva na pasta "uploads/")
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

let users = []; // banco em memória só pra teste

// Listar todos
router.get('/', (req, res) => {
  res.json(users);
});

// Criar novo usuário
router.post('/', upload.single('photo'), (req, res) => {
  const { name, email } = req.body;
  const photo = req.file ? `/uploads/${req.file.filename}` : null;
  const user = { id: Date.now(), name, email, photo };
  users.push(user);
  res.status(201).json(user);
});

// Remover usuário
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(u => u.id !== id);
  res.json({ message: 'Usuário removido' });
});

module.exports = router;
