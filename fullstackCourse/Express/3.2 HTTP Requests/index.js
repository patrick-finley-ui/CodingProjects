import express from "express";
const app = express();

const port = 3000;


app.get("/", (req, res) => {
    console.log(req.rawHeaders);
    res.send("<h1>Hello</h1>");
});

app.get("/about", (req, res) => {
    console.log(req.rawHeaders);
    res.send("<p>I'm a Sales Engineer</p>");
});

app.get("/contact", (req, res) => {
    console.log(req.rawHeaders);
    res.send("<h1>Phone Number is 1234567890</h1>");
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});