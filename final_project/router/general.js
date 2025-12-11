const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  // Correct placeholder for Task 6: Register New User
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop (TASK 1 IMPLEMENTATION)
public_users.get('/',function (req, res) {
  // Correct location for Task 1 code
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // 1. Retrieve the ISBN from the request parameters (Hint)
    const isbn = req.params.isbn;

    // 2. Check if the ISBN exists in the imported 'books' object
    if (books[isbn]) {
        // 3. If found, return the book details
        return res.status(200).json(books[isbn]);
    } else {
        // 4. If not found, return a 404 error
        return res.status(404).json({message: `Book with ISBN ${isbn} not found.`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
