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
  .then(getAuthorsAndGenresForBooks)
}
const getBookById = (id) => {
  const sql = `
    SELECT *
    FROM books
    WHERE id = $1`
  return db.one(sql, [id])
}

//Monica look at this
const getAuthorsForBookIds = (bookIds) => {
  const sql = `
    SELECT authors.*, book_authors.book_id
    FROM authors
    JOIN book_authors
    ON book_authors.author_id = authors.id
    WHERE book_authors.book_id IN ($1:csv)`
  return db.any(sql, [bookIds])
}

const getGenresForBookIds = (bookIds) => {
  const sql = `
    SELECT genres.*, book_genres.book_id
    FROM genres
    JOIN book_genres
    ON book_genres.genre_id = genres.id
    WHERE book_genres.book_id IN ($1:csv)`
  return db.any(sql, [bookIds])
}

const getAuthorsAndGenresForBooks = (books) => {
  const bookIds = books.map(book => book.id)
  return Promise.all([
    getAuthorsForBookIds(bookIds),
    getGenresForBookIds(bookIds),
  ]).then(results => {
    const authors = results[0]
    const genres = results[1]
    books.forEach(book => {
      book.authors = authors.filter(author => author.book_id === book.id)
      book.genres = genres.filter(genre => genre.book_id === book.id)
    })
    return books;
  })
}

const getBookAuthors = function(id){
  const sql = `
    SELECT
      authors.name
    FROM
      authors
    JOIN
      book_authors
    ON
      authors.id = book_authors.author_id
    WHERE
      book_authors.book_id = $1;
  `
  return db.any(sql, [id])
}

const getBookGenres = function(id){
  const sql = `
    SELECT
      genres.name
    FROM
      genres
    JOIN
      book_genres
    ON
      genres.id = book_genres.genre_id
    WHERE
      book_genres.book_id = $1;
  `
  return db.any(sql, [id])
}

const getBookAndAuthorsAndGenresByBookId = (id) => {
  return Promise.all([
    getBookById(id),
    getBookAuthors(id),
    getBookGenres(id),
  ])
  .catch(function(error){
    console.log(error)
    throw error;
  })
  .then((results) => {
    const book = results[0]
    const authors = results[1]
    const genres = results[2]

    book.authors = authors
    book.genres = genres
    return book;
  })
}

const CREATE_BOOK_SQL = `INSERT INTO books (title, fiction) VALUES ($1, $2) RETURNING *`

const createBook = book => {
  return generateBookEntry( book )
    .then( addAuthorsAndGenres )
    .then( respondWithBookId )
}

const generateBookEntry = book =>
  Promise.all([
    db.one( CREATE_BOOK_SQL, [ book.title, book.fiction ]),
    new Promise( (resolve, reject) => resolve( book.genres )),
    ...book.authors.filter( author => author.length > 0 )
      .map( author => createAuthor( author ) )
  ])

const addAuthorsAndGenres = results => {
  const bookResult = results[ 0 ]
  const bookId = parseInt( bookResult.id )

  const genres = results[ 1 ]

  const authors = results.slice( 2 )
  const authorIds = authors.map( author => author.id )

  return Promise.all([
    joinAuthorsWithBook( authorIds, bookId ),
    joinGenresWithBook( genres, bookId ),
    new Promise( (resolve, reject) => resolve( bookId ) )
  ])
}

const respondWithBookId = results => results[ 2 ]
//
// const createBook = book => {
//   return Promise.all([
//     db.one( CREATE_BOOK_SQL, [ book.title, book.fiction ]),
//     ...book.authors.filter( author => author.length > 0 )
//       .map( author => createAuthor( author ) )
//   ])
//   .then( results => {
//     const bookResult = results[ 0 ]
//     const bookId = parseInt( bookResult.id )
//
//     const authors = results.slice( 1 )
//     const authorIds = authors.map( author => author.id )
//
//     return Promise.all([
//       joinAuthorsWithBook( authorIds, bookId ),
//       joinGenresWithBook( book.genres, bookId ),
//       new Promise( (resolve, reject) => resolve( bookId ) )
//     ])
//   })
//   .then( results => {
//     return results[ 2 ]
//   })
// }

const createAuthor = name => {
  const sql = `
    INSERT INTO authors (name)
    VALUES ($1)
    RETURNING *`
  return db.one(sql, [ name ])
}

const JOIN_AUTHOR_BOOK_SQL = `INSERT INTO book_authors(book_id, author_id) VALUES ($1, $2) RETURNING *`

const joinAuthorsWithBook = (authorIds, bookId) => {
  return Promise.all(
    authorIds.map( authorId =>
      db.one( JOIN_AUTHOR_BOOK_SQL, [ bookId, parseInt( authorId )] )
    )
  )
}

const JOIN_GENRE_BOOK_SQL = `INSERT INTO book_genres(book_id, genre_id) VALUES ($1, $2) RETURNING *`

const joinGenresWithBook = (genreIds, bookId) => {
  return Promise.all(
    genreIds.map( genreId =>
      db.one( JOIN_GENRE_BOOK_SQL, [ bookId, parseInt( genreId ) ])
    )
  )
}

const getAllGenres = () => {
  return db.any('SELECT * FROM genres')
}

const searchForBooks = (options) => {
  let variables = []
  let sql = `
    SELECT DISTINCT(books.*)
    FROM books`
  let whereConditions = []
  if (options.fiction !== '') {
    variables.push(options.fiction === 'true')
    whereConditions.push(`
      books.fiction IS $${variables.length}
      `)
  }
  if (options.genres.length > 0) {
    sql += `
      LEFT JOIN book_genres
      ON book_genres.book_id=books.id
    `
    variables.push(options.genres)
    whereConditions.push(`
      book_genres.genre_id IN ($${variables.length}:csv)
    `)
  }
  if (options.search_query) {
    sql += `
      LEFT JOIN book_authors
      ON book_authors.book_id=books.id
      LEFT JOIN authors
      ON authors.id=book_authors.author_id
    `
    variables.push(options.search_query
      .toLowerCase()
      .replace(/^ */, '%')
      .replace(/ *$/, '%')
      .replace(/ +/g, '%')
    )
    whereConditions.push(`
      (
        LOWER(books.title) LIKE $${variables.length}
      OR
        LOWER(authors.name) LIKE $${variables.length}
      )
    `)
  }
  if (whereConditions.length > 0) {
    sql += ' WHERE '+whereConditions.join(' AND ')
  }
  console.log('SQL --->', sql, variables)
  return db.any(sql, variables)
}
const deleteBook = (bookId) => {
  const sql = `DELETE FROM books WHERE books.id = $1`
  return db.one(sql, [bookId])
}

// const UPDATE_BOOK_SQL = `UPDATE books SET title = $1, fiction = $2 WHERE books.id = $3 RETURNING *`
// const UPDATE_AUTHOR_SQL = `UPDATE authors SET name = $1 WHERE authors.id = $2 RETURNING *`
//
// const updateAuthor = ( name, id ) => {
//   return db.one( UPDATE_AUTHOR_SQL, [ name, id ])
// }
// //
// const updateBook = book => {
//   return Promise.all([
//     db.one( UPDATE_AUTHOR_SQL, [ book.title, book.fiction, book.id ]),
//     ...book.authors.filter( author => author.length > 0)
//       .map( author => updateAuthor( author) )
//   ])
//   .then( results => {
//     const result[0]
//   })
// }

const end = () => pgp.end()

export default { getAllBooks, getBookById, getAuthorsAndGenresForBooks, getBookAuthors, getBookGenres, getBookAndAuthorsAndGenresByBookId, createBook, createAuthor, joinGenresWithBook, joinAuthorsWithBook, getAllGenres, searchForBooks, deleteBook, end }
