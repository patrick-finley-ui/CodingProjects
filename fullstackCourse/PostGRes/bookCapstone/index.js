
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
