import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";



const port = 3000;

const app = express();

// JSON file path for storing blog posts
const DATA_FILE = "blog-posts.json";

// Helper functions for JSON file operations
const loadBlogPosts = () => {
    try {
        if (fs.existsSync(DATA_FILE)) {
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error("Error loading blog posts:", error);
    }
    return [];
};

const saveBlogPosts = (posts) => {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2));
        console.log("Blog posts saved to file");
    } catch (error) {
        console.error("Error saving blog posts:", error);
    }
};

// Load blog posts from JSON file on startup
let blogPosts = loadBlogPosts();

const navLinks = [
    { text: 'Food and Cooking', url: '/food-cooking' },
    { text: 'Travel', url: '/travel' },
    { text: 'Health and Wellness', url: '/health-wellness' },
    { text: 'Arts and Crafts', url: '/arts-crafts' },
    { text: 'Books and Writing', url: '/books-writing' },
    { text: 'Gaming', url: '/gaming' }
];

app.use(express.static("public"));

// Set up body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// GET route - Home page
app.get("/", (req, res) => {
    // Reload posts from file to ensure we have latest data
    blogPosts = loadBlogPosts();
    res.render("index.ejs", {
        blogPosts: blogPosts,
        navLinks: navLinks,
        showFilters: true,  // Add flag to show filter buttons
        deleted: req.query.deleted === 'true'  // Check if post was deleted
    });
});

// POST route
app.post("/", (req, res) => {
    console.log("=== FORM SUBMISSION ===");
    console.log("Title:", req.body.Title);
    console.log("Content:", req.body.PostText);
    console.log("Content length:", req.body.PostText ? req.body.PostText.length : 0);
    
    const newPost = {
        id: blogPosts.length > 0 ? Math.max(...blogPosts.map(p => p.id)) + 1 : 0,
        title: req.body.Title,
        content: req.body.PostText,
        createdAt: new Date().toISOString(),
        author: "Anonymous", // You can add this field later
        tags: [], // Easy to add tags later
        views: 0, // Easy to add view count
        blogArea: req.body.blogArea
    };
    
    blogPosts.push(newPost);
    saveBlogPosts(blogPosts); // Save to JSON file
    
    console.log("New post added:", newPost);
    console.log("Total posts now:", blogPosts.length);
    
    res.render("index.ejs", {
        blogPosts: blogPosts,
        navLinks: navLinks,
        showFilters: true  // Add flag to show filter buttons
    });
});

// Individual post route
app.get("/post/:id", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(p => p.id === postId);
    
    if (post) {
        res.render("post.ejs", {
            post: post,
            navLinks: navLinks
        });
    } else {
        res.status(404).send("Post not found");
    }
});

// DELETE post route
app.delete("/post/:id", (req, res) => {
    console.log("\n🔥🔥🔥 DELETE REQUEST RECEIVED 🔥🔥🔥");
    console.log("Request URL:", req.url);
    console.log("Request method:", req.method);
    console.log("Post ID from params:", req.params.id);
    
    blogPosts = loadBlogPosts(); // Reload from file
    const postId = parseInt(req.params.id);
    console.log("Parsed post ID:", postId);
    console.log("Current blog posts:", blogPosts.map(p => ({ id: p.id, title: p.title })));
    
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    console.log("Found post at index:", postIndex);
    
    if (postIndex !== -1) {
        // Remove the post from the array
        blogPosts.splice(postIndex, 1);
        saveBlogPosts(blogPosts); // Save updated array to file
        console.log(`Post ${postId} deleted successfully`);
        console.log("Remaining posts:", blogPosts.map(p => ({ id: p.id, title: p.title })));
        
        // Return success response instead of redirect
        res.status(200).json({ success: true, message: "Post deleted successfully" });
    } else {
        // Post not found
        console.log("Post not found!");
        res.status(404).json({ success: false, message: "Post not found" });
    }
});

// GET edit post route
app.get("/edit/:id", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const postId = parseInt(req.params.id);
    const post = blogPosts.find(p => p.id === postId);
    
    if (post) {
        res.render("index.ejs", {
            blogPosts: blogPosts,
            navLinks: navLinks,
            showFilters: true,
            editingPost: post,  // Pass the post being edited
            isEditMode: true    // Flag to indicate edit mode
        });
    } else {
        res.status(404).send("Post not found");
    }
});

// POST edit post route
app.post("/edit/:id", (req, res) => {
    console.log("=== EDIT FORM SUBMISSION ===");
    console.log("Title:", req.body.Title);
    console.log("Content:", req.body.PostText);
    console.log("Content length:", req.body.PostText ? req.body.PostText.length : 0);
    
    blogPosts = loadBlogPosts(); // Reload from file
    const postId = parseInt(req.params.id);
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        // Update the existing post
        blogPosts[postIndex] = {
            ...blogPosts[postIndex],
            title: req.body.Title,
            content: req.body.PostText,
            blogArea: req.body.blogArea,
            updatedAt: new Date().toISOString()
        };
        
        saveBlogPosts(blogPosts); // Save updated post to file
        console.log("Post updated:", blogPosts[postIndex]);
        
        res.render("index.ejs", {
            blogPosts: blogPosts,
            navLinks: navLinks,
            showFilters: true,
            updated: true  // Flag to show success message
        });
    } else {
        res.status(404).send("Post not found");
    }
});

// Filtered blog area routes - specific routes first
app.get("/food-cooking", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'food-cooking');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'food-cooking',
        showFilters: false
    });
});

app.get("/travel", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'travel');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'travel',
        showFilters: false
    });
});

app.get("/health-wellness", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'health-wellness');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'health-wellness',
        showFilters: false
    });
});

app.get("/arts-crafts", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'arts-crafts');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'arts-crafts',
        showFilters: false
    });
});

app.get("/books-writing", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'books-writing');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'books-writing',
        showFilters: false
    });
});

app.get("/gaming", (req, res) => {
    blogPosts = loadBlogPosts(); // Reload from file
    const filteredPosts = blogPosts.filter(post => post.blogArea === 'gaming');
    res.render("index.ejs", {
        blogPosts: filteredPosts,
        navLinks: navLinks,
        currentFilter: 'gaming',
        showFilters: false
    });
});

app.listen(port, () => {
   console.log("Server is running on port 3000");
});
