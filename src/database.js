const databaseName = process.env.NODE_ENV === 'lgbookstore'
const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp(connectionString);

const truncateAllTables = () => {
  return db.none(`
    TRUNCATE
      books,
      genres,
      authors,
      book_genres,
      book_authors
  `)
}

const getAllBooks = (page) => {
  const offset = (page-1) * 10;
  return db.any('SELECT * FROM books LIMIT 10 OFFSET $1', [offset]
}
