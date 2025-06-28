  const mongoose = require('mongoose');
  const purchaseSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    supplier: { type: String, required: true },
    amount: { type: Number, required: true }, // Total cost (wholesalePrice * quantity)
    stockName: { type: String, required: true },
    modelNo: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, default: 'pending' },
    purchaseDate: { type: Date, required: true }, // New field for purchase date
    wholesalePrice: { type: Number, required: true, min: 0 }, // Price paid to wholesaler
    salePrice: { type: Number, required: true, min: 0 }, // Planned retail price
    createdAt: { type: Date, default: Date.now },
  });
  module.exports = mongoose.model('Purchase', purchaseSchema); 