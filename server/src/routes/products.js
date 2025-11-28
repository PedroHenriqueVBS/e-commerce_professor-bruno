const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// LISTAR
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// CRIAR
router.post("/", async (req, res) => {
  const { name, price, stock, image } = req.body;

  const product = await Product.create({
    name,
    price,
    stock,
    image,
  });

  res.status(201).json(product);
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { name, price, stock, image } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, stock, image },
      { new: true } // retorna atualizado
    );

    if (!updated) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    res.json(updated);
    
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Produto removido" });
});

module.exports = router;
