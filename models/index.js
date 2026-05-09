const Author = require('./Author');
const Book = require('./Book');
const Member = require('./Member');
const Borrow = require('./Borrow');

// One-to-Many: One Author has many Books
Author.hasMany(Book, { foreignKey: 'AuthorId', onDelete: 'RESTRICT' });
Book.belongsTo(Author, { foreignKey: 'AuthorId' });

// Many-to-Many: Members borrow many Books through Borrow junction
Member.belongsToMany(Book, { through: Borrow, foreignKey: 'MemberId' });
Book.belongsToMany(Member, { through: Borrow, foreignKey: 'BookId' });

// Direct associations for Borrow table access
Member.hasMany(Borrow, { foreignKey: 'MemberId' });
Borrow.belongsTo(Member, { foreignKey: 'MemberId' });
Book.hasMany(Borrow, { foreignKey: 'BookId' });
Borrow.belongsTo(Book, { foreignKey: 'BookId' });

module.exports = { Author, Book, Member, Borrow };
