
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
app.set("view engine", "ejs");
const port = 3000;




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
  try {
    const book = await db.query("INSERT INTO books (title, author, isbn, published_year, genre, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *", [book.title, book.author, book.isbn, book.published_year, book.genre, book.image]);
    const review = await db.query("INSERT INTO reviews (book_id,rating, notes, review_date) VALUES ($1, $2, $3, $4) RETURNING *", [book.id, book.rating, book.notes, book.review_date]);
    res.redirect("/");
  } catch (error) {
    console.error("Error adding book", error);
    res.status(500).send("An error occurred while adding the book.");
  }
});

app.get("/", async (req, res) => {
  try {
    const books = await db.query("SELECT * FROM book");
    console.log(books.rows);

    // Attempt to fetch covers for each book and update the image field
    const updatedBooks = await Promise.all(
      books.rows.map(async (book) => {
        try {
          console.log(`Fetching cover for ISBN:${book.isbn}`);
          const response = await axios.get(
            `https://openlibrary.org/api/books?bibkeys=ISBN:${book.isbn}&jscmd=data&format=json`
          );
          const data = response.data;
          console.log(data);
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

    res.render("index.ejs", { books: updatedBooks });
  } catch (error) {
    console.error("Error fetching book data", error);
    res.status(500).send("An error occurred while fetching books.");
  }
});







app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
