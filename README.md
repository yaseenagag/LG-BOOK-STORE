## Description

Create a simple content management system that allows users to add, delete, or update books.  Books entered in the system can be viewed in a listing, or searched for using basic searches (title, author, genre).

## Instructions:
 * Clone the project from github
 * NPM Install
 * Create lgbookstore database in Postgres SQL ```psql createdb lgbookstore```
 * Run the schema SQL file in the database by typing ```psql lgbookstore < schema.sql```

## Context

Creating this web application will provide exposure to:
* Express (or other web framework)
* Javascript
* Simple relational database interactions (Create, Read, Update, Delete), with SQL practice
* Simple server side templating (to render data retrieved from the database)

## Specifications

- [X] Any user can add books into the system via an admin page
- [X] Books entered in the system are listed on the home page, in pages of 10
- [X] Users can search for books by title OR by author OR by genre, and search results will be presented on the search page
- [X] Users can view book details on a book details page, linked to from the listing or search pages
- [X] All code submissions are peer reviewed via GitHub PR by at least two members of the team, and master is always in a stable state (tests passed, site functions)

### Required

- [X] The artifact produced is properly licensed, preferably with the [MIT license][mit-license].

## Quality Rubric

- Code is well formatted without any linting errors
- Variables, functions, css classes, etc. are meaningfully named (no comments exist in code to explain functionality - the names serve that function)
- Functions are small and serve a single purpose
- Code is well organized into a meaningful file structure
- Code is reasonably tested with a test suite
- Interface is user friendly

## Resources
Model -
http://ondras.zarovi.cz/sql/demo/
---

<!-- LICENSE -->

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/80x15.png" /></a>
<br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.

[mit-license]: https://opensource.org/licenses/MIT
