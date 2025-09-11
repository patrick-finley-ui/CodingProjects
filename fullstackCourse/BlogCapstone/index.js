import express from "express";
import bodyParser from "body-parser";



const port = 3000;

const app = express();

// Data structure
const blogPosts = [];


app.use(express.static("public"));

// Set up body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// GET route
app.get("/", (req, res) => {
    res.render("index.ejs", {
        blogPosts: blogPosts
    });
});

// POST route
app.post("/", (req, res) => {
    console.log("=== FORM SUBMISSION ===");
    console.log("Title:", req.body.Title);
    console.log("Content:", req.body.PostText);
    
    const newPost = {
        id: blogPosts.length, // Auto-incrementing ID
        title: req.body.Title,
        content: req.body.PostText,
        createdAt: new Date(),
        author: "Anonymous", // You can add this field later
        tags: [], // Easy to add tags later
        views: 0 // Easy to add view count
    };
    
    blogPosts.push(newPost);
    
    console.log("New post added:", newPost);
    console.log("Total posts now:", blogPosts.length);
    
    res.render("index.ejs", {
        blogPosts: blogPosts
    });
});

// Individual post route
app.get("/post/:id", (req, res) => {
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(p => p.id === postId);
    
    if (post) {
        res.render("post.ejs", {
            post: post
        });
    } else {
        res.status(404).send("Post not found");
    }
});

app.listen(port, () => {
   console.log("Server is running on port 3000");
});
