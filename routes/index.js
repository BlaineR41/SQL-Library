var express = require('express');
const router = express.Router();

// Step 6 import Book model from the ../models folder
var Book = require('../models').Book;

//Handler function to callback routes
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error) {
      next(error);
    }
  }
}

/* GET home page. */

router.get('/', asyncHandler(async (req, res) => {
res.redirect('/books');
})
);

// S8 get /books - Shows the full list of books

router.get('/books', asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  console.log(books);
  res.render('index', {books});
}));

// S8 get /books/new - Shows the create new book form

router.get('/books/new', asyncHandler (async (req, res) => {
  res.render('new-book', {books: {}, title: 'New Book'});
}));

//S8 post /books/new - Posts a new book to the database

router.post('/books/new', asyncHandler (async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/');
  } catch (error) {
    res.render('new-book', {book, errors: error.errors, title: 'New Book'})
  } 
}));

//S8 get /books/:id - Shows book detail form

router.get('/books/:id', asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render('update-book', {book, title: book.title});
  } else {
    const error = new Error('404 Error - Book not found');
    error.status = 404;
    next(error);
  }
}));

//S8 post /books/:id - Updates book info in the database

router.post('/books/:id', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect('/');
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render('update-book', {book, errors:error.errors, title: 'Book Update'});
    } else {
      throw error;
    }
  }
}));

//S8 post /books/:id/delete - Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting

router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/');
  } else {
    res.sendStatus(404);
  }
}))


module.exports = router;