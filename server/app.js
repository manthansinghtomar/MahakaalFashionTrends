import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import authRouter from './routes/auth.routes.js';
import uploadRouter from './routes/upload.routes.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import offerRouter from './routes/offer.routes.js';
import contactRouter from './routes/contact.routes.js';
import newsletterRouter from './routes/newsletter.routes.js';
import dashboardRouter from './routes/admin.dashboard.routes.js';

// Load environment variables
dotenv.config();

const app = express();

// Set up standard middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files if needed in the future
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/products', productRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/offers', offerRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin', dashboardRouter);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MahakaalFashionTrends Backend Running Successfully',
  });
});

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Fallback error middlewares (404 and global handler)
app.use(notFound);
app.use(errorHandler);

export default app;
