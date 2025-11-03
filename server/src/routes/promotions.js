const express = require('express');
const router = express.Router();
const products = require('../data/products');

// In-memory promotions store
let promotions = [];
let nextId = 1;

// Helper to attach product_name
function enrichPromotion(promo) {
  const product = promo.product_id != null ? products.find(p => p.id === promo.product_id) : null;
  return {
    ...promo,
    product_name: product ? product.name : undefined,
  };
}

router.get('/', async (req, res) => {
  const rows = promotions.map(enrichPromotion);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { product_id, discount, start_date, end_date } = req.body;
  const newPromo = {
    id: nextId++,
    product_id: product_id || null,
    discount: Number(discount) || 0,
    start_date: start_date || null,
    end_date: end_date || null,
  };
  promotions.push(newPromo);
  res.status(201).json(enrichPromotion(newPromo));
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  promotions = promotions.filter(p => p.id !== id);
  res.status(204).send();
});

module.exports = router;
