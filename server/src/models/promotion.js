const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  discount: {
    type: Number,
    required: true
  },
  start_date: {
    type: Date,
    default: null
  },
  end_date: {
    type: Date,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model("Promotion", PromotionSchema);
