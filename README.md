# Library System API

## About

This project is a RESTful backend API for a Library Management System built as the CPE 114 Final Project. The system solves the real-world problem of managing a library's catalog, membership, and book borrowing operations through a clean, organized API.

The problem being addressed is straightforward but important: libraries need to track which books they own, who their registered members are, and which member has borrowed which book at any given time. Without a reliable backend system, this becomes a chaotic paper-based process prone to errors — books go missing, members borrow more than allowed, and staff have no clear view of what's available. This API provides a digital solution that handles all of that logic automatically.

The system manages three core entities: **Authors**, **Books**, and **Members**. Authors have a one-to-many relationship with Books — one author can write many books, but each book belongs to exactly one author. Members and Books share a many-to-many relationship through a `Borrow` junction table, which also stores metadata about each borrowing event such as the borrow date, return date, and current status. This design reflects how libraries actually work: one member can borrow many books over time, and one book can be borrowed by many different members across different periods.

The API enforces basic inventory rules: a book cannot be borrowed if no copies are available, a member cannot borrow the same book twice without returning it first, and returning a book automatically restores the available copy count. All endpoints return consistent JSON responses with appropriate HTTP status codes, and all errors are handled gracefully without exposing internal server details to the client.

---

## Tech Stack

| Technology | Version |
|---|---|
| Node.js | v18+ |
| Express.js | ^4.19.2 |
| Sequelize ORM | ^6.37.3 |
| MySQL | 8.0+ |
| mysql2 (driver) | ^3.9.7 |
| dotenv | ^16.4.5 |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd library-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=library_db
DB_USER=root
DB_PASSWORD=yourpassword
PORT=3000
```

### 4. Create the database
In MySQL, run:
```sql
CREATE DATABASE library_db;
```

### 5. Start the server
```bash
npm start
```
Sequelize will automatically create all tables on startup. You should see:
```
Database synced successfully.
Library API running at http://localhost:3000
```

---

## Database Schema

### `authors`
| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(150) | NOT NULL |
| nationality | VARCHAR(100) | nullable |
| birthYear | INT | nullable |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `books`
| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| title | VARCHAR(255) | NOT NULL |
| isbn | VARCHAR(20) | NOT NULL, UNIQUE |
| publishedYear | INT | nullable |
| genre | VARCHAR(100) | nullable |
| copiesAvailable | INT | NOT NULL, DEFAULT 1 |
| AuthorId | INT | NOT NULL, FK → authors.id |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `members`
| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(150) | NOT NULL |
| email | VARCHAR(255) | NOT NULL, UNIQUE |
| phone | VARCHAR(20) | nullable |
| membershipDate | DATEONLY | NOT NULL, DEFAULT NOW |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

### `borrows` (Junction Table)
| Column | Type | Constraints |
|---|---|---|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| MemberId | INT | FK → members.id |
| BookId | INT | FK → books.id |
| borrowDate | DATEONLY | NOT NULL |
| returnDate | DATEONLY | nullable |
| status | ENUM('borrowed','returned') | NOT NULL, DEFAULT 'borrowed' |
| createdAt | DATETIME | auto |
| updatedAt | DATETIME | auto |

---

## ER Diagram

```
AUTHORS          BOOKS                MEMBERS
--------         ---------            ---------
id (PK)    1──< id (PK)              id (PK)
name            title                name
nationality     isbn (unique)        email (unique)
birthYear       publishedYear        phone
                genre                membershipDate
                copiesAvailable
                AuthorId (FK)

                    BORROWS (junction)
                    ------------------
                    id (PK)
                    MemberId (FK) >──< MEMBERS.id
                    BookId   (FK) >──< BOOKS.id
                    borrowDate
                    returnDate
                    status
```

Relationships:
- **Author → Book**: One-to-Many (`Author.hasMany(Book)`, `Book.belongsTo(Author)`)
- **Member ↔ Book**: Many-to-Many through `Borrow` (`Member.belongsToMany(Book)`, `Book.belongsToMany(Member)`)

---

## API Reference

### Authors

| Method | Path | Body | Description |
|---|---|---|---|
| GET | /authors | — | Get all authors |
| GET | /authors/:id | — | Get author by ID (includes their books) |
| POST | /authors | `{ name, nationality?, birthYear? }` | Create an author |
| PUT | /authors/:id | `{ name?, nationality?, birthYear? }` | Update an author |
| DELETE | /authors/:id | — | Delete an author |

### Books

| Method | Path | Body | Description |
|---|---|---|---|
| GET | /books | — | Get all books (includes author info) |
| GET | /books/:id | — | Get book by ID (includes author + borrowers) |
| POST | /books | `{ title, isbn, AuthorId, publishedYear?, genre?, copiesAvailable? }` | Create a book |
| PUT | /books/:id | `{ title?, isbn?, AuthorId?, publishedYear?, genre?, copiesAvailable? }` | Update a book |
| DELETE | /books/:id | — | Delete a book |

### Members

| Method | Path | Body | Description |
|---|---|---|---|
| GET | /members | — | Get all members |
| GET | /members/:id | — | Get member by ID (includes borrowed books) |
| POST | /members | `{ name, email, phone?, membershipDate? }` | Create a member |
| PUT | /members/:id | `{ name?, email?, phone?, membershipDate? }` | Update a member |
| DELETE | /members/:id | — | Delete a member |

### Borrow / Return (Relationship Endpoints)

| Method | Path | Body | Description |
|---|---|---|---|
| POST | /members/:memberId/borrow/:bookId | — | Member borrows a book |
| PUT | /members/:memberId/return/:bookId | — | Member returns a book |
| GET | /members/:memberId/books | — | List all borrow records for a member |

---

## Error Responses

| Status | When | JSON Structure |
|---|---|---|
| 400 | Missing required fields or invalid input | `{ "error": "descriptive message" }` |
| 404 | Record not found by ID | `{ "error": "Resource not found" }` |
| 404 | Undefined route accessed | `{ "error": "Route not found: METHOD /path" }` |
| 500 | Unexpected server error | `{ "error": "Internal Server Error" }` |

**Example 400:**
```json
{ "error": "title, isbn, and AuthorId are required" }
```

**Example 404:**
```json
{ "error": "Book not found" }
```
