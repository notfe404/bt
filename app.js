const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const Tree = require('./models/Tree');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/TreeShop', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB database: TreeShop");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
});
const upload = multer({ storage: storage });

// App Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
    try {
        const trees = await Tree.find();
        res.render('index', { trees });
    } catch (error) {
        console.error("Error fetching trees:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { treename, description } = req.body;
        const image = req.file ? req.file.filename : '';

        // Validation (backend fallback)
        if (!treename || !description) {
            return res.status(400).send("Tree Name and Description are required.");
        }

        const newTree = new Tree({
            treename,
            description,
            image
        });

        await newTree.save();
        res.redirect('/');
    } catch (error) {
        console.error("Error adding tree:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/about', (req, res) => {
    res.render('about');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
