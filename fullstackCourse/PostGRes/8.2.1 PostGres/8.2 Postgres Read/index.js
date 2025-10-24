import express from "express";
import bodyParser from "body-parser";

import pg from "pg";

const app = express();
const port = 3000;

let totalCorrect = 0;
let quiz = [{}];
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Set EJS as the view engine
app.set("view engine", "ejs");



const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "test123",
  port: 5432,
});

db.connect();

db.query(
  "SELECT * FROM capitals JOIN flags ON flags.name = capitals.country",
  (err, result) => {
 
    if(err) {
      console.error("Error executing query", err.stack);
    }
    else {
  
      console.log(result.rows.slice(0, 10));
      const quiz = result.rows
    }
    db.end();
})


let currentQuestion = {};

// GET home page
app.get("/", (req, res) => {
  totalCorrect = 0;
  nextQuestion();
  console.log(currentQuestion);
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];
  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
