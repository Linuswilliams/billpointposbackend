const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const contactRouter = require('./routes/contact');
const accountRouter = require('./routes/account');
const notificationsRouter = require('./routes/notifications')
const usersRouter = require('./routes/users');
const posApplicationRouter = require('./routes/posApplication');
const cors = require('cors')
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    console.error(err.stack); // Log stack trace
    process.exit(1);
  }
};

// Initialize Express

const app = express();

const allowedOrigins = [
  'https://www.billpointpos.co',
  'https://admin.billpointpos.co',
  'http://localhost:3000'
];


const corsOptions = {
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);  // Allow access
    } else {
      callback(new Error('Not allowed by CORS'));  // Deny access
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};



app.use(cors(corsOptions));
app.use(express.json());

// Use Routes
app.use('/api', contactRouter);
app.use('/api', posApplicationRouter);
app.use('/api', accountRouter);
app.use('/api', notificationsRouter);
app.use('/api', usersRouter);



app.get('/', (req, res) => {
  res.send('Blord Server is up and running');
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || 'Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
});


const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  try {
    console.log('Server connected');
    await connectDB();
  } catch (err) {
    console.error('Error starting server:', err.message);
  }
});
