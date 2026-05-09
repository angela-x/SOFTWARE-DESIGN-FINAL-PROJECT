const { Book, Author, Member } = require('../models');

// GET /books
const getAllBooks = async (req, res, next) => {
  try {
    const books = await Book.findAll({
      include: [{ model: Author, attributes: ['id', 'name'] }],
    });
    res.json(books);
  } catch (err) {
    next(err);
  }
};

// GET /books/:id
const getBookById = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: [
        { model: Author, attributes: ['id', 'name', 'nationality'] },
        { model: Member, attributes: ['id', 'name', 'email'], through: { attributes: ['borrowDate', 'returnDate', 'status'] } },
      ],
    });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

// POST /books
const createBook = async (req, res, next) => {
  try {
    const { title, isbn, publishedYear, genre, copiesAvailable, AuthorId } = req.body;
    if (!title || !isbn || !AuthorId) {
      return res.status(400).json({ error: 'title, isbn, and AuthorId are required' });
    }
    const author = await Author.findByPk(AuthorId);
    if (!author) return res.status(400).json({ error: 'Author not found with provided AuthorId' });

    const book = await Book.create({ title, isbn, publishedYear, genre, copiesAvailable, AuthorId });
    res.status(201).json(book);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'A book with this ISBN already exists' });
    }
    next(err);
  }
};

// PUT /books/:id
const updateBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    const { title, isbn, publishedYear, genre, copiesAvailable, AuthorId } = req.body;
    await book.update({ title, isbn, publishedYear, genre, copiesAvailable, AuthorId });
    res.json(book);
  } catch (err) {
    next(err);
  }
};

// DELETE /books/:id
const deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    await book.destroy();
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBooks, getBookById, createBook, updateBook, deleteBook };
