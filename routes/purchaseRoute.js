// const express = require('express');
// const router = express.Router();
// const Purchase = require('../models/Purchase');
// const Stock = require('../models/Stock');

// // Get all purchases with search and sort
// router.get('/', async (req, res) => {
//   try {
//     const { search, sortBy, order } = req.query;
//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { orderId: { $regex: search, $options: 'i' } },
//           { supplier: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }
//     const sort = {};
//     if (sortBy) {
//       sort[sortBy] = order === 'desc' ? -1 : 1;
//     }
//     const purchases = await Purchase.find(query).sort(sort);
//     res.json(purchases);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create a purchase and add to stock if completed
// router.post('/', async (req, res) => {
//   try {
//     const purchase = new Purchase(req.body);
//     await purchase.save();

//     // Create stock record if purchase is completed
//     if (purchase.status === 'completed') {
//       const stock = new Stock({
//         orderNo: purchase.orderId,
//         stockName: purchase.stockName,
//         modelNo: purchase.modelNo,
//         purchaseOrigin: purchase.supplier,
//         dateOfPurchase: new Date(),
//         quantity: purchase.quantity,
//         purchaseId: purchase._id,
//       });
//       await stock.save();
//     }

//     res.status(201).json(purchase);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Update a purchase and sync stock if needed
// router.put('/:id', async (req, res) => {
//   try {
//     const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

//     // Update or create stock if status is completed
//     if (purchase.status === 'completed') {
//       let stock = await Stock.findOne({ purchaseId: purchase._id });
//       if (stock) {
//         // Update existing stock
//         stock.orderNo = purchase.orderId;
//         stock.stockName = purchase.stockName;
//         stock.modelNo = purchase.modelNo;
//         stock.purchaseOrigin = purchase.supplier;
//         stock.quantity = purchase.quantity;
//         await stock.save();
//       } else {
//         // Create new stock
//         stock = new Stock({
//           orderNo: purchase.orderId,
//           stockName: purchase.stockName,
//           modelNo: purchase.modelNo,
//           purchaseOrigin: purchase.supplier,
//           dateOfPurchase: new Date(),
//           quantity: purchase.quantity,
//           purchaseId: purchase._id,
//         });
//         await stock.save();
//       }
//     } else {
//       // Remove stock if status is not completed
//       await Stock.deleteOne({ purchaseId: purchase._id });
//     }

//     res.json(purchase);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Delete a purchase and remove associated stock
// router.delete('/:id', async (req, res) => {
//   try {
//     const purchase = await Purchase.findByIdAndDelete(req.params.id);
//     if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

//     // Remove associated stock
//     await Stock.deleteOne({ purchaseId: purchase._id });

//     res.json({ message: 'Purchase deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Stock = require('../models/Stock');

router.get('/', async (req, res) => {
  try {
    const { search, sortBy, order } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { orderId: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }
    const purchases = await Purchase.find(query).sort(sort);
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const purchase = new Purchase(req.body);
    await purchase.save();

    if (purchase.status === 'completed') {
      const stock = new Stock({
        orderNo: purchase.orderId,
        stockName: purchase.stockName,
        modelNo: purchase.modelNo,
        purchaseOrigin: purchase.supplier,
        dateOfPurchase: purchase.purchaseDate,
        quantity: purchase.quantity,
        salePrice: purchase.salePrice,
        purchaseId: purchase._id,
      });
      await stock.save();
    }

    res.status(201).json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

    if (purchase.status === 'completed') {
      let stock = await Stock.findOne({ purchaseId: purchase._id });
      if (stock) {
        stock.orderNo = purchase.orderId;
        stock.stockName = purchase.stockName;
        stock.modelNo = purchase.modelNo;
        stock.purchaseOrigin = purchase.supplier;
        stock.dateOfPurchase = purchase.purchaseDate;
        stock.quantity = purchase.quantity;
        stock.salePrice = purchase.salePrice;
        await stock.save();
      } else {
        stock = new Stock({
          orderNo: purchase.orderId,
          stockName: purchase.stockName,
          modelNo: purchase.modelNo,
          purchaseOrigin: purchase.supplier,
          dateOfPurchase: purchase.purchaseDate,
          quantity: purchase.quantity,
          salePrice: purchase.salePrice,
          purchaseId: purchase._id,
        });
        await stock.save();
      }
    } else {
      await Stock.deleteOne({ purchaseId: purchase._id });
    }

    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ error: 'Purchase not found' });

    await Stock.deleteOne({ purchaseId: purchase._id });

    res.json({ message: 'Purchase deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;