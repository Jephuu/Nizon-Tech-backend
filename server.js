// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// // const userRoutes = require('./routes/users');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Routes
// // app.use('/api/users', userRoutes);
// // app.use('/api/stats', require('./routes/stats'));
// app.use('/api/stocks', require('./routes/stockRoute'));
// app.use('/api/purchases', require('./routes/purchaseRoute'));
// app.use('/api/sales', require('./routes/saleRoute'));
// app.use('/api/bills', require('./routes/billRoute'));

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const purchaseRoutes = require('./routes/purchaseRoute');
const stockRoutes = require('./routes/stockRoute');
const billRoutes = require('./routes/billRoute');
const authRoutes = require('./routes/authRoute');
const saleRoutes = require('./routes/saleRoute');
const authMiddleware = require('./middleware/authMiddleware');


dotenv.config();


const app = express();

// Middleware   
app.use(cors({
  origin: ['https://nizon-tech-react-app.vercel.app', 'http://localhost:5174'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/purchases', authMiddleware, purchaseRoutes);
app.use('/api/stocks', authMiddleware, stockRoutes); 
app.use('/api/bills', authMiddleware, billRoutes);
app.use('/api/sales', authMiddleware,saleRoutes);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));