// const mongoose = require('mongoose');
// const saleSchema = new mongoose.Schema({
//   saleId: { type: String, required: true, unique: true },
//   customer: { type: String, required: true },
//   amount: { type: Number, required: true },
//   date: { type: Date, default: Date.now },
// });
// module.exports = mongoose.model('Sale', saleSchema);

const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  items: [
    {
      stockName: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ],
  date: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Sale', saleSchema);