import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;



const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "test123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");

let currentUserId = 1;
// Call the function on startup
ensureItemsTable();

let items = await getItems();

async function getItems() {
  const result = await db.query("SELECT * FROM items order by ID ASC");
  return result.rows;
}


// Function to check if the 'items' table exists, if not, create it and add initial data
async function ensureItemsTable() {
  try {
    // Check if the 'items' table exists
    const result = await db.query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'items'
      );`
    );

    const exists = result.rows[0].exists;

    if (!exists) {
      // Create the 'items' table
      await db.query(
        `CREATE TABLE items (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL
        );`
      );

      // Insert initial data
      await db.query(
        `INSERT INTO items (title) VALUES 
        ($1), ($2);`,
        ["Buy milk", "Finish homework"]
      );
      console.log("Created 'items' table and inserted initial items.");
    } else {
      console.log("'items' table already exists.");
    }
  } catch (err) {
    console.error("Error ensuring 'items' table:", err);
  }
}





app.get("/", async (req, res) => {
  items = await getItems();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  try {
    // Use RETURNING id to get the new user's id
    const result = await db.query(
      "INSERT INTO items (title) values ($1)", [item]
    );
    // Set currentUserId to the new user's id
    
    res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }

});

app.post("/edit", async (req, res) =>
{
   const newTitle = req.body.updatedItemTitle;
  const taskId = req.body.updatedItemId;
  try {
    const result = await db.query("UPDATE items SET title = $1 where id = $2", [newTitle, taskId]);
    res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }
});


app.post("/delete", async (req, res) => {
  
  const taskId = req.body.deleteItemId;
  try {
    const result = await db.query("DELETE FROM items where id = $1", [taskId]);
    res.redirect("/");
  }
  catch (err) {
    console.log(err);
  }
  
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
