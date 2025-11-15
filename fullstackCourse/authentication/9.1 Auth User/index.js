import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Secrets",
  password: "test123",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
 
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email);
  console.log(password);
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      await db.query("INSERT INTO users (email, password) VALUES ($1, $2)", [email, password]);
      res.render("secrets.ejs");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while registering. Please try again.");
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.username;
  const password = req.body.password;
  console.log(email);
  console.log(password);
  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (checkResult.rows.length === 0) {
      res.send("Email not found. Please register.");
    } else {
      const result = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
      if (result.rows.length > 0) {
        res.render("secrets.ejs");
      } else {
        res.send("Incorrect Password");
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while registering. Please try again.");
  }


});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
