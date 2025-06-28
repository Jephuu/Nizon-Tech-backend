// const mongoose = require('mongoose');
// const stockSchema = new mongoose.Schema({
//   orderNo: { type: String, required: true, unique: true },
//   stockName: { type: String, required: true },
//   modelNo: { type: String, required: true },
//   purchaseOrigin: { type: String, required: true },
//   dateOfPurchase: { type: Date, required: true },
//   quantity: { type: Number, required: true, min: 1 }, // New field for quantity
//   purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }, // Reference to purchase
//   createdAt: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model('Stock', stockSchema);

const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  stockName: { type: String, required: true },
  modelNo: { type: String, required: true },
  purchaseOrigin: { type: String, required: true },
  dateOfPurchase: { type: Date, required: function() { return !this.purchaseId; } },
  quantity: { type: Number, required: true, min: 1 },
  salePrice: { type: Number, required: function() { return !this.purchaseId; }, min: 0 },
  purchaseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Purchase', default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Stock', stockSchema);