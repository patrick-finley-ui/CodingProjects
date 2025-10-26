
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
app.set("view engine", "ejs");
const port = 3000;

const sortby = "rating";


const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "BookProject",
  password: "test123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get("/add-review", (req, res) => {
  res.render("add-review.ejs");
});


app.post("/add-review", async (req, res) => {

  const book = req.body;
  console.log(book);
  try {
    const bookResult = await db.query("INSERT INTO books (title, author, isbn, published_year, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *", [book.title, book.author, book.isbn, book.published_year, book.genre]);
    console.log(bookResult.rows[0]);
    const reviewResult = await db.query(
      "INSERT INTO reviews (book_id, rating, notes, review_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        bookResult.rows[0].book_id,
        book.rating,
        book.notes,
        new Date()
      ]
    );
    console.log("Review added", reviewResult.rows[0]);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding book", error);
    res.status(500).send("An error occurred while adding the book.");
  }
});




app.get("/", async (req, res) => {
  const sortby = req.query.sort || "rating";
  console.log(sortby);
  try {
    // Whitelist allowed sort columns
    const allowedSorts = ['rating', 'review_date', 'title', 'author', 'published_year'];
    const validSort = allowedSorts.includes(sortby) ? sortby : 'rating';
    
    const books = await db.query(
      `SELECT * FROM books JOIN reviews ON books.book_id = reviews.book_id ORDER BY ${validSort} DESC`
    );
 

    // Attempt to fetch covers for each book and update the image field
    const updatedBooks = await Promise.all(
      books.rows.map(async (book) => {
        try {
          // console.log(`Fetching cover for ISBN:${book.isbn}`);
          const response = await axios.get(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${book.isbn}&jscmd=data&format=json`
          );
          const data = response.data;
      
          const coverData = data[`ISBN:${book.isbn}`];
          if (coverData && coverData.cover && coverData.cover.medium) {
            // Replace the image only if cover is found
            book.image = coverData.cover.medium;
          }
        } catch (err) {
          console.error(`No cover found for ISBN:${book.isbn}`);
        }
        return book;
      })
    );
    console.log(updatedBooks[0]);
    res.render("index.ejs", { books: updatedBooks,sortby: sortby});
  } catch (error) {
    console.error("Error fetching book data", error);
    res.status(500).send("An error occurred while fetching books.");
  }
});


app.get("/book/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log(bookId);
    const book = await db.query(
      "SELECT * FROM books JOIN reviews ON books.book_id = reviews.book_id WHERE books.book_id = $1",
      [bookId]
    );

    if (!book.rows.length) {
      return res.status(404).send("Book not found");
    }

    let imageUrl = null;
    try {
      const image = await axios.get(
        `https://openlibrary.org/api/books?bibkeys=ISBN:${book.rows[0].isbn}&jscmd=data&format=json`
      );
      const imgData = image.data[`ISBN:${book.rows[0].isbn}`];
      if (imgData && imgData.cover && imgData.cover.medium) {
        imageUrl = imgData.cover.medium;
      }
    } catch (err) {
      console.error("Error fetching book cover image", err);
    }
    book.rows[0].image = imageUrl;
    console.log(book.rows[0]);
    res.render("book.ejs", { book: book.rows[0] });
  } catch (error) {
    console.error("Error retrieving book", error);
    res.status(500).send("An error occurred while fetching the book details.");
  }
});




app.get("/edit-book/:id", async (req,res) => {
  const bookId = req.params.id;
  const book = await db.query("SELECT * FROM books JOIN reviews ON books.book_id = reviews.book_id WHERE books.book_id = $1", [bookId]);
  console.log("Edit book", book.rows[0]);
  res.render("edit-review.ejs", { book: book.rows[0] });
});

app.post("/edit-book/:id", async (req,res) => {
  const bookId = req.params.id;
  const book = req.body;
  console.log(book);
  const bookResult = await db.query("UPDATE books SET title = $1, author = $2, isbn = $3, published_year = $4, genre = $5 WHERE book_id = $6", [book.title, book.author, book.isbn, book.published_year, book.genre, bookId]);
  console.log(bookResult.rows[0]);
  res.redirect("/");
});


app.post("/delete-book/:id", async (req,res) => {
  const bookId = req.params.id;
  const book = await db.query("DELETE FROM books WHERE book_id = $1", [bookId]);
  console.log(book.rows[0]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
