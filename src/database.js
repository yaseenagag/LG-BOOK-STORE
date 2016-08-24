// const databaseName = process.env.NODE_ENV === 'lgbookstore'
// const connectionString = `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')();
const db = pgp({ database: 'lgbookstore' })
// const db = pgp(connectionString);

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

const getAllBooks = (page=1, size=10) => {
  const offset = (page-1) * size;
  return db.any('SELECT * FROM books LIMIT $2 OFFSET $1', [offset, size])
}

const end = () => pgp.end()

export default { getAllBooks, end }
