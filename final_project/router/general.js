const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// --- TASK 6: Register a new user (Synchronous) ---
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


// --- ASYNC HELPER FUNCTIONS

// Helper function for Task 10: Get All Books
function getBookList() {
    return new Promise((resolve, reject) => {
        // Resolve the Promise with the entire 'books' object
        resolve(books);
    });
}

// --- TASK 10: Get the list of books available in the shop (Async/Await) ---
// This replaces the old synchronous Task 1 implementation
public_users.get('/', async function (req, res) {
    try {
        const bookList = await getBookList();
        return res.status(200).json(bookList);
    } catch (error) {
        return res.status(500).json({ message: "Failed to retrieve book list." });
    }
});


// --- TASK 11: Get book details based on ISBN (Async/Await) ---
// This replaces the old synchronous Task 2 implementation
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const book = await getBookDetails(isbn); 
        return res.status(200).json(book);
    } catch (error) {
        // Handle the rejection (Book not found)
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

// Helper function for Task 11: Get Book by ISBN
function getBookDetails(isbn) {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); // Resolve with the book object
        } else {
            reject(new Error("Book not found")); // Reject if ISBN is invalid
        }
    });
}

// Helper function for Task 12: Get Book by Author
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        let booksByAuthor = {};

        for (const isbn in books) {
            if (books[isbn].author === author) {
                booksByAuthor[isbn] = books[isbn];
            }
        }
        
        if (Object.keys(booksByAuthor).length > 0) {
            resolve(booksByAuthor); // Resolve with the list of matching books
        } else {
            reject(new Error("Author not found")); // Reject if no books by that author
        }
    });
}

/// Get book details based on Author (TASK 12 IMPLEMENTATION - Async/Await)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    
    try {
        const foundBooks = await getBooksByAuthor(author); 
        return res.status(200).json({ booksbyauthor: foundBooks });
    } catch (error) {
        // Handle the rejection (Author not found)
        return res.status(404).json({ message: `No books found by author: ${author}` });
    }
});

// In ./router/general.js (Add this helper function)

// Helper function for Task 13: Get Book by Title
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        let booksByTitle = {};

        for (const isbn in books) {
            // Use includes() for partial matching
            if (books[isbn].title.includes(title)) {
                booksByTitle[isbn] = books[isbn];
            }
        }
        
        if (Object.keys(booksByTitle).length > 0) {
            resolve(booksByTitle); // Resolve with the list of matching books
        } else {
            reject(new Error("Title not found")); // Reject if no books match the title
        }
    });
}
// Get all books based on title (TASK 13 IMPLEMENTATION - Async/Await)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    
    try {
        const foundBooks = await getBooksByTitle(title); 
        return res.status(200).json({ booksbytitle: foundBooks });
    } catch (error) {
        // Handle the rejection (Title not found)
        return res.status(404).json({ message: `No books found with title: ${title}` });
    }
});


// --- TASK 5: Get book review (Original synchronous implementation) ---
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