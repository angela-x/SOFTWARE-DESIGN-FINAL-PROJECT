const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  isbn: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
  },
  publishedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  genre: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  copiesAvailable: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  // FK to Author (one-to-many: one Author has many Books)
  AuthorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'authors', key: 'id' },
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
