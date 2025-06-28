const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Get all bills with search and sort
router.get('/', async (req, res) => {
  try { 
    const { search, sortBy, order } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { billId: { $regex: search, $options: 'i' } },
          { customer: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const sort = {};
    if (sortBy) {
      sort[sortBy] = order === 'desc' ? -1 : 1;
    }
    const bills = await Bill.find(query).sort(sort);
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a bill
router.post('/', async (req, res) => {
  try {
    const bill = new Bill(req.body);
    await bill.save();
    res.status(201).json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a bill
router.put('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    res.json({ message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;