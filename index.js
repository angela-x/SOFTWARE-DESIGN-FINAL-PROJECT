require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
require('./models'); // load models and associations

const logger = require('./middleware/logger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const authorRoutes = require('./routes/authors');
const bookRoutes = require('./routes/books');
const memberRoutes = require('./routes/members');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware
app.use(express.json());

// Custom logger middleware
app.use(logger);

// Routes
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);
app.use('/members', memberRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Library API is running' });
});

// 404 catch-all
app.use(notFound);

// Global error handler (must be last, must have 4 params)
app.use(errorHandler);

// Sync DB and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Library API running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  });
