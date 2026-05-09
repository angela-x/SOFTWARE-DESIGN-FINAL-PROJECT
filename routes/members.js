const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/memberController');
const { borrowBook, returnBook, getMemberBooks } = require('../controllers/borrowController');

router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', createMember);
router.put('/:id', updateMember);
router.delete('/:id', deleteMember);

// Relationship-specific endpoints
router.post('/:memberId/borrow/:bookId', borrowBook);
router.put('/:memberId/return/:bookId', returnBook);
router.get('/:memberId/books', getMemberBooks);

module.exports = router;
