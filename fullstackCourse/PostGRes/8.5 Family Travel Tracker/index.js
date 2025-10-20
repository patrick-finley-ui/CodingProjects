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

let currentUserId = 1;

let users = await getUserList();

async function checkVisisted() {
  const result = await db.query("SELECT country_code FROM visited_countries");
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

async function getUserList() {
  const result = await db.query("SELECT * FROM users");
  let users = result.rows
  return users;
}

async function getUserById(userId) {
  const result = await db.query("SELECT * FROM users where id = $1", [userId]);
  let user = result.rows[0];
  return user;
}

async function checkVisistedByUser(userId) {
  const result = await db.query("SELECT country_code FROM visited_countries where userid = $1", [userId]);
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}

app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: "teal",
  });
});


app.post("/add", async (req, res) => {
  const input = req.body["country"];

  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );

    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code, userid) VALUES ($1, $2)",
        [countryCode, currentUserId]
      );
      res.redirect(`/user?userId=${currentUserId}`);
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});

app.get("/user", async (req, res) => {
  const userId = req.query.userId;
  console.log("user id: " + userId);
  if (userId) {
    currentUserId = userId;
  }
    console.log("userid is " + currentUserId);
    const userCountries = await checkVisistedByUser(currentUserId);
  
    const user = await getUserById(currentUserId);
    console.log(user);
    console.log(user.color);
    res.render("index.ejs", {
      countries: userCountries,
      total: userCountries.length,
      users: users,
      color: user.color,
    })
  }
 
);

app.post("/user", async (req, res) => {
  currentUserId = req.body.user;
  if (currentUserId) {
    console.log("userid is " + currentUserId);
    const userCountries = await checkVisistedByUser(currentUserId);
  
    const user = await getUserById(currentUserId);
    console.log(user);
    console.log(user.color);
    res.render("index.ejs", {
      countries: userCountries,
      total: userCountries.length,
      users: users,
      color: user.color,
    });
  }
   else {
    res.render("new.ejs");
  };
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  const user = {
    name: req.body.name,
    color: req.body.color
  }
  console.log(user);
  try {
    // Use RETURNING id to get the new user's id
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING id",
      [user.name, user.color]
    );
    // Set currentUserId to the new user's id
    currentUserId = result.rows[0].id;
    users = await getUserList();
    res.redirect(`/user?userId=${currentUserId}`);
  }
  catch (err) {
    console.log(err);
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
