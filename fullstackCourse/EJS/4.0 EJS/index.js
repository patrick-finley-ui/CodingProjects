import express from "express";
import ejs from "ejs";
import path from "path";


const app = express();
const port = 3000;



app.get("/", (req, res) => {
    res.render("index.ejs",
        {
            dayOfWeek: new Date().getDay()
        }
    );
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});