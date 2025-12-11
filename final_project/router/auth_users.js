const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => user.username === username);
  return userswithsamename.length === 0;
}

const authenticatedUser = (username,password)=>{
  let valid_users = users.filter((user) => user.username === username && user.password === password);
  return valid_users.length > 0;
}

regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in: Username and password are required"});
    }

    if (authenticatedUser(username, password)) {
        // Sign JWT token and store in session
        let token = jwt.sign({ data: password }, 'fingerprint_customer', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken: token,
            username: username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        // 208 is a common status code for "Already Reported" or non-fatal authentication failure
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});
// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; 
    const username = req.session.authorization.username; 

    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found."});
    }

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({message: `Review for ISBN ${isbn} by user ${username} added/updated.`});
});

// In ./router/auth_users.js

regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    // Get the username from the session established during login
    const username = req.session.authorization.username; 

    // 1. Check if the book exists
    if (!books[isbn]) {
        // Must return a response here
        return res.status(404).json({message: "Book not found."});
    }

    // 2. Check if the specific user's review exists for that book
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        // Delete the review
        delete books[isbn].reviews[username]; 
        // Must return a response here (Success)
        return res.status(200).json({message: `Review for ISBN ${isbn} by user ${username} deleted.`});
    } else {
        // Must return a response here (Review not found)
        return res.status(404).json({message: `No review found for user ${username} on ISBN ${isbn}.`});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
