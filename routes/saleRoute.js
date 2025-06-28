// const express = require('express');
// const router = express.Router();
// const Sale = require('../models/Sale');

// // Get all sales with search and sort
// router.get('/', async (req, res) => {
//   try {
//     const { search, sortBy, order } = req.query;
//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { saleId: { $regex: search, $options: 'i' } },
//           { customer: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }
//     const sort = {};
//     if (sortBy) {
//       sort[sortBy] = order === 'desc' ? -1 : 1;
//     }
//     const sales = await Sale.find(query).sort(sort);
//     res.json(sales);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create, Update, Delete routes remain the same as previously provided
// router.post('/', async (req, res) => {
//   try {
//     const sale = new Sale(req.body);
//     await sale.save();
//     res.status(201).json(sale);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   try {
//     const sale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!sale) return res.status(404).json({ error: 'Sale not found' });
//     res.json(sale);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// router.delete('/:id', async (req, res) => {
//   try {
//     const sale = await Sale.findByIdAndDelete(req.params.id);
//     if (!sale) return res.status(404).json({ error: 'Sale not found' });
//     res.json({ message: 'Sale deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Stock = require('../models/Stock');

router.get('/', async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    let query = {};
    if (search) {
      query = {
        'items.stockName': { $regex: search, $options: 'i' },
      };
    }
    const sort = {};
    if (sortBy) {
      if (sortBy === 'totalAmount') {
        const sales = await Sale.find(query);
        const sortedSales = sales.sort((a, b) => {
          const totalA = a.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
          const totalB = b.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
          return order === 'asc' ? totalA - totalB : totalB - totalA;
        });
        return res.json(sortedSales);
      }
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }
    const sales = await Sale.find(query).sort(sort);
    res.json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const sale = new Sale(req.body);
    for (const item of sale.items) {
      const stock = await Stock.findOne({ stockName: item.stockName });
      if (!stock || stock.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.stockName}`);
      }
      await Stock.updateOne(
        { stockName: item.stockName },
        { $inc: { quantity: -item.quantity } }
      );
    }
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    const oldItems = [...sale.items];
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    for (const item of oldItems) {
      await Stock.updateOne(
        { stockName: item.stockName },
        { $inc: { quantity: item.quantity } }
      );
    }
    for (const item of updatedSale.items) {
      const stock = await Stock.findOne({ stockName: item.stockName });
      if (!stock || stock.quantity < item.quantity) {
        throw new Error(`Insufficient stock for ${item.stockName}`);
      }
      await Stock.updateOne(
        { stockName: item.stockName },
        { $inc: { quantity: -item.quantity } }
      );
    }
    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const sale = await Sale.findByIdAndDelete(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Sale not found' });
    for (const item of sale.items) {
      await Stock.updateOne(
        { stockName: item.stockName },
        { $inc: { quantity: item.quantity } }
      );
    }
    res.json({ message: 'Sale deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;