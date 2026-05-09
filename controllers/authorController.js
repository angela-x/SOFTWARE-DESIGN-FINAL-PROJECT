const { Author, Book } = require('../models');

// GET /authors
const getAllAuthors = async (req, res, next) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (err) {
    next(err);
  }
};

// GET /authors/:id
const getAuthorById = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: [{ model: Book, attributes: ['id', 'title', 'isbn', 'genre'] }],
    });
    if (!author) return res.status(404).json({ error: 'Author not found' });
    res.json(author);
  } catch (err) {
    next(err);
  }
};

// POST /authors
const createAuthor = async (req, res, next) => {
  try {
    const { name, nationality, birthYear } = req.body;
    if (!name) return res.status(400).json({ error: 'name is required' });
    const author = await Author.create({ name, nationality, birthYear });
    res.status(201).json(author);
  } catch (err) {
    next(err);
  }
};

// PUT /authors/:id
const updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    const { name, nationality, birthYear } = req.body;
    await author.update({ name, nationality, birthYear });
    res.json(author);
  } catch (err) {
    next(err);
  }
};

// DELETE /authors/:id
const deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByPk(req.params.id);
    if (!author) return res.status(404).json({ error: 'Author not found' });
    await author.destroy();
    res.json({ message: 'Author deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllAuthors, getAuthorById, createAuthor, updateAuthor, deleteAuthor };
