const express = require("express");
const app = express();
app.use(express.json())

const Io = require("./utils/io")
const Blogs = new Io("./database/blogs.json")

const Blog = require("./models/blog")

app.post("/blog", async (req, res) => {
    const {description, title} = req.body

    if(!description || !title)
        return res.status(400).json({message: "Description and Title is required"});

    const blogs = await Blogs.read();

    const id = (blogs[blogs.length - 1]?.id || 0) + 1;

    const newBlog = new Blog(id, description, title);

    const data = blogs.length ? [...blogs, newBlog] : [newBlog];

    await Blogs.write(data)

    res.status(201).json({message: "Successfully created"})
})

app.get("/blogs", async (req, res) =>{
    const blogs = await Blogs.read();

    res.json({blogs});
})

app.get("/blog/:id", async(req, res) => {
    const {id} = req.params;

    const {description, title} = req.body;

    const blogs = await Blogs.read();

    const findBlog = blogs.find((blog) => blog.id == id);

    if(!findBlog)
        return res.status(404).json({message: "Blog not found"})

    findBlog.counter+=1;
    await Blogs.write(blogs)
    
    res.json({findBlog});
})

app.put("/blog/:id", async(req, res) => {
    const {id} = req.params;

    const {discription, title} = req.body;

    const blogs = await Blogs.read();

    const findBlog = blogs.find((blog) => blog.id == id);

    if(!findBlog)
        return res.status(404).json({message: "Blog not found"})

    findBlog.discription = discription ? discription : findBlog.discription;
    findBlog.title = title ? title : findBlog.title;

    await Blogs.write(blogs);

    res.json({message: "Successfully Updated"});
})

app.delete("/blog/:id", async (req, res) => {
    const {id} = req.params;

    const blogs = await Blogs.read();

    const filterBlogs = blogs.filter((blog) => blog.id != id);

    await Blogs.write(filterBlogs);

    res.json({message: "Successfully Deleted"})
})

app.listen(4000, () => {
    console.log("4000");
});