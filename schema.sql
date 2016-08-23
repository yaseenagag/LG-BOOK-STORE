DROP TABLE IF EXISTS books;

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  fiction BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS authors;

CREATE TABLE authors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_authors;

CREATE TABLE book_authors (
  book_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL
);

DROP TABLE IF EXISTS genres;

CREATE TABLE genres (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS book_genres;

CREATE TABLE book_genres (
  book_id INTEGER NOT NULL,
  genre_id INTEGER NOT NULL
);

--- Data Injection

INSERT INTO books (title, fiction)
VALUES ('Gone With the Wind', true),
('Wealth of Nations', false),
('The Alchemist', true),
('The Great Gatsby', false);

INSERT INTO authors (name)
VALUES ('Adam Smith'),
('Paulo Coehlo'),
('F. Scott Fitzgerald'),
('Margaret Mitchell');

INSERT INTO genres (name)
VALUES ('Economics'),
('Science Fiction'),
('Fantasy'),
('Young Adult'),
('Historical Drama'),
('Romance'),
('Horror'),
('Satire');

--- Join Tables Start Here

INSERT INTO book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'The Great Gatsby'
AND
  authors.name = 'F. Scott Fitzgerald';

INSERT INTO book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'Wealth of Nations'
AND
  authors.name = 'Adam Smith';

INSERT INTO book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'The Alchemist'
AND
  authors.name = 'Paulo Coehlo';

INSERT INTO book_authors
SELECT
  books.id, authors.id
FROM
  books
CROSS JOIN
  authors
WHERE
  books.title = 'Gone With the Wind'
AND
  authors.name = 'Margaret Mitchell';

INSERT INTO book_genres
SELECT
  books.id, genres.id
FROM
  books
CROSS JOIN
  genres
WHERE
  books.title = 'Wealth of Nations'
AND
  genres.name = 'Economics';
