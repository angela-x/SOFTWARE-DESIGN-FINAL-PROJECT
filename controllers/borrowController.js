const { Borrow, Member, Book } = require('../models');

// POST /members/:memberId/borrow/:bookId  — borrow a book
const borrowBook = async (req, res, next) => {
  try {
    const { memberId, bookId } = req.params;

    const member = await Member.findByPk(memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    if (book.copiesAvailable < 1) {
      return res.status(400).json({ error: 'No copies available for this book' });
    }

    // Check if already borrowed and not returned
    const existing = await Borrow.findOne({
      where: { MemberId: memberId, BookId: bookId, status: 'borrowed' },
    });
    if (existing) {
      return res.status(400).json({ error: 'Member already has an active borrow for this book' });
    }

    const borrow = await Borrow.create({
      MemberId: memberId,
      BookId: bookId,
      borrowDate: new Date(),
      status: 'borrowed',
    });

    await book.update({ copiesAvailable: book.copiesAvailable - 1 });

    res.status(201).json({ message: 'Book borrowed successfully', borrow });
  } catch (err) {
    next(err);
  }
};

// PUT /members/:memberId/return/:bookId  — return a book
const returnBook = async (req, res, next) => {
  try {
    const { memberId, bookId } = req.params;

    const borrow = await Borrow.findOne({
      where: { MemberId: memberId, BookId: bookId, status: 'borrowed' },
    });
    if (!borrow) {
      return res.status(404).json({ error: 'No active borrow record found for this member and book' });
    }

    await borrow.update({ returnDate: new Date(), status: 'returned' });

    const book = await Book.findByPk(bookId);
    await book.update({ copiesAvailable: book.copiesAvailable + 1 });

    res.json({ message: 'Book returned successfully', borrow });
  } catch (err) {
    next(err);
  }
};

// GET /members/:memberId/books  — list all books a member has borrowed
const getMemberBooks = async (req, res, next) => {
  try {
    const member = await Member.findByPk(req.params.memberId);
    if (!member) return res.status(404).json({ error: 'Member not found' });

    const borrows = await Borrow.findAll({
      where: { MemberId: req.params.memberId },
      include: [{ model: Book, attributes: ['id', 'title', 'isbn', 'genre'] }],
    });

    res.json(borrows);
  } catch (err) {
    next(err);
  }
};

module.exports = { borrowBook, returnBook, getMemberBooks };
