const mongoose = require('mongoose');

// MongoDB URI (replace <username>, <password>, <dbname> with your credentials)
const MONGODB_URI = 'mongodb+srv://fullstack:2r6FcH9cLQRdnXHJ@cluster0.xgr0xci.mongodb.net/';

// Connect to MongoDB Atlas
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB Atlas:", err);
    });

// Define blog schema
const blogSchema = new mongoose.Schema({
    author: String,
    url: { type: String, required: true },
    title: { type: String, required: true },
    likes: { type: Number, default: 0 }
});

// Define the model
const Blog = mongoose.model('Blog', blogSchema);

// Function to create and save blogs
async function createBlogs() {
    const blog1 = new Blog({
        author: 'John Doe',
        url: 'https://example.com/first-blog',
        title: 'My First Blog',
        likes: 5
    });

    const blog2 = new Blog({
        author: 'Jane Smith',
        url: 'https://example.com/second-blog',
        title: 'Learning MongoDB',
        likes: 12
    });

    try {
        await blog1.save();
        console.log('First blog saved!');
        await blog2.save();
        console.log('Second blog saved!');
    } catch (err) {
        console.log('Error saving blogs:', err);
    }
}

// Fetch all blogs
async function fetchBlogs() {
    try {
        const blogs = await Blog.find();  // Using async/await for find()
        console.log('Blogs:', blogs);
    } catch (err) {
        console.log('Error fetching blogs:', err);
    }
}

// Call functions to create and fetch blogs
createBlogs();
fetchBlogs();
