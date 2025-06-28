// const mongoose = require('mongoose');

// const billSchema = new mongoose.Schema({
//   billId: { type: String, required: true, unique: true },
//   customer: { type: String, required: true },
//   dueDate: { type: Date, required: true },
//   items: [{
//     no: { type: Number, required: true },
//     particulars: { type: String, required: true },
//     qty: { type: Number, required: true, min: 1 },
//     rate: { type: Number, required: true, min: 0 },
//     amount: { type: Number, required: true, min: 0 }, // qty * rate
//   }],
//   totalAmount: { type: Number, required: true, min: 0 }, // Sum of items.amount
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Bill', billSchema);

const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billId: { type: String, required: true },
  customer: { type: String, required: true },
  dueDate: { type: Date, required: true },
  items: [{
    no: { type: Number, required: true },
    particulars: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 },
    amount: { type: Number, required: true, min: 0 },
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Bill', billSchema);