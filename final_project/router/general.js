const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// In ./router/general.js 

public_users.post("/register", (req,res) => {
    // Retrieve username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        // Check if the username is available using the imported isValid function
        if (isValid(username)) { 
            // SUCCESS: Username is new/valid
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            // FAILURE: Username already exists
            return res.status(409).json({message: "User already exists!"}); 
        }
    }
    // FAILURE: Username or password missing
    return res.status(400).json({message: "Unable to register user. Ensure username and password are provided."}); 
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
    // Retrieve the author name from the request parameters
    const author = req.params.author;
    let booksByAuthor = {};

    // 1. Get keys (ISBNs) and iterate through the books object
    for (const isbn in books) {
        // 2. Check if the book's author matches the requested author
        if (books[isbn].author === author) {
            // Add the matching book to the result object
            booksByAuthor[isbn] = books[isbn];
        }
    }

    // Check if any books were found
    if (Object.keys(booksByAuthor).length > 0) {
        return res.status(200).json({booksbyauthor: booksByAuthor});
    } else {
        return res.status(404).json({message: `No books found by author: ${author}`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Retrieve the title from the request parameters
    const title = req.params.title;
    let booksByTitle = {};

    // Iterate through the books object
    for (const isbn in books) {
        // Use includes() or strict comparison to check if the book's title matches
        if (books[isbn].title.includes(title)) { 
            // Add the matching book to the result object
            booksByTitle[isbn] = books[isbn];
        }
    }

    // Check if any books were found
    if (Object.keys(booksByTitle).length > 0) {
        return res.status(200).json({booksbytitle: booksByTitle});
    } else {
        return res.status(404).json({message: `No books found with title: ${title}`});
    }
});

// Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the ISBN exists and if it has a reviews property
    if (books[isbn] && books[isbn].reviews) {
        // Return ONLY the reviews object for the specified book
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({message: `Book with ISBN ${isbn} not found or has no reviews.`});
    }
});

module.exports.general = public_users;
