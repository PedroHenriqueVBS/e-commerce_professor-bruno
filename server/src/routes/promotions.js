const express = require("express");
const router = express.Router();
const Promotion = require("../models/promotion");

// LISTAR
router.get("/", async (req, res) => {
  const promos = await Promotion.find().populate("product_id", "name price");
  res.json(promos);
});

// CRIAR
router.post("/", async (req, res) => {
  const { product_id, discount, start_date, end_date } = req.body;

  const promo = await Promotion.create({
    product_id,
    discount,
    start_date,
    end_date,
  });

  res.status(201).json(promo);
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { product_id, discount, start_date, end_date } = req.body;

    const updated = await Promotion.findByIdAndUpdate(
      req.params.id,
      { product_id, discount, start_date, end_date },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Promoção não encontrada" });
    }

    res.json(updated);

  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar promoção" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Promotion.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

module.exports = router;
