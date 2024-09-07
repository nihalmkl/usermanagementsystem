const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const path = require('path');
const app = express();
const port = 3000;
const flash = require('connect-flash');
const nocache = require('nocache')
// Database connection
mongoose.connect('mongodb://127.0.0.1:27017/user_management')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Session configuration
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(flash())


// View engine configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'))

app.use(nocache())

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', userRoutes);
app.use('/admin',adminRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});