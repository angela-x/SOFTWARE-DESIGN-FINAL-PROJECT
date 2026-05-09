const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Junction model for the many-to-many relationship between Members and Books
const Borrow = sequelize.define('Borrow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  borrowDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  returnDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('borrowed', 'returned'),
    allowNull: false,
    defaultValue: 'borrowed',
  },
}, {
  tableName: 'borrows',
  timestamps: true,
});

module.exports = Borrow;
