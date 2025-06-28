// const express = require('express');
// const router = express.Router();
// const Stock = require('../models/Stock');

// // Get all stocks with search and sort
// router.get('/', async (req, res) => {
//   try {
//     const { search, sortBy, order } = req.query;
//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { orderNo: { $regex: search, $options: 'i' } },
//           { stockName: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }
//     const sort = {};
//     if (sortBy) {
//       sort[sortBy] = order === 'desc' ? -1 : 1;
//     }
//     const stocks = await Stock.find(query).sort(sort);
//     res.json(stocks);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create a stock (manual creation, if needed)
// router.post('/', async (req, res) => {
//   try {
//     const stock = new Stock(req.body);
//     await stock.save();
//     res.status(201).json(stock);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Update a stock
// router.put('/:id', async (req, res) => {
//   try {
//     const stock = await Stock.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!stock) return res.status(404).json({ error: 'Stock not found' });
//     res.json(stock);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete a stock
// router.delete('/:id', async (req, res) => {
//   try {
//     const stock = await Stock.findByIdAndDelete(req.params.id);
//     if (!stock) return res.status(404).json({ error: 'Stock not found' });
//     res.json({ message: 'Stock deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Stock = require('../models/Stock');

router.get('/', async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { orderNo: { $regex: search, $options: 'i' } },
          { stockName: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }
    const stocks = await Stock.find(query)
      .populate('purchaseId', 'purchaseDate salePrice stockName modelNo orderId')
      .sort(sort);
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { purchaseId, dateOfPurchase, salePrice, ...stockData } = req.body;
    if (purchaseId) {
      return res.status(400).json({ error: 'Manual stock creation cannot include purchaseId' });
    }
    if (!dateOfPurchase || salePrice === undefined) {
      return res.status(400).json({ error: 'dateOfPurchase and salePrice required for manual stock creation' });
    }
    const stock = new Stock({ ...stockData, dateOfPurchase, salePrice, purchaseId: null });
    await stock.save();
    res.status(201).json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { purchaseId, dateOfPurchase, salePrice, ...stockData } = req.body;
    if (purchaseId) {
      return res.status(400).json({ error: 'Manual stock update cannot include purchaseId' });
    }
    if (!dateOfPurchase || salePrice === undefined) {
      return res.status(400).json({ error: 'dateOfPurchase and salePrice required for manual stock update' });
    }
    const stock = await Stock.findByIdAndUpdate(req.params.id, { ...stockData, dateOfPurchase, salePrice, purchaseId: null }, {
      new: true,
      runValidators: true,
    });
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    await stock.populate('purchaseId', 'purchaseDate salePrice stockName modelNo orderId');
    res.json(stock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const stock = await Stock.findByIdAndDelete(req.params.id);
    if (!stock) return res.status(404).json({ error: 'Stock not found' });
    res.json({ message: 'Stock deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;