<<<<<<< HEAD
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

// --- 1. DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'placement_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed: ' + err.message);
        return;
    }
    console.log('✅ Connected to MySQL Database!');
});

// --- 2. MAIN ROUTE (Student & Jobs View) ---
app.get('/', (req, res) => {
    
    db.query('SELECT * FROM students', (err, studentsList) => {
        if (err) {
            console.error("Student Query Error:", err);
            return res.status(500).send("Database Error: " + err.message);
        }

        
        db.query('SELECT * FROM jobs', (err, jobsList) => {
            if (err) {
                console.error("Job Query Error:", err);
                return res.status(500).send("Database Error: " + err.message);
            }

            
            const firstStudent = studentsList.length > 0 ? studentsList[0] : { name: "Guest", cgpa: 0 };

            
            res.render('index', { 
                students: studentsList, // Poori list
                student: firstStudent,   // Header ke liye single object
                jobs: jobsList           // Jobs card dikhane ke liye
            });
        });
    });
});

// --- 3. ADMIN ROUTE ---
app.get('/admin', (req, res) => {
    db.query('SELECT * FROM applications', (err, results) => {
        if (err) return res.send("Admin Error");
        res.render('admin', { applications: results });
    });
});

// --- SERVER START ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying at http://localhost:${PORT}`);
=======
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();

// --- MIDDLEWARE ---
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); 

// --- 1. DATABASE CONNECTION ---
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'placement_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('❌ Database Connection Failed: ' + err.message);
        return;
    }
    console.log('✅ Connected to MySQL Database!');
});

// --- 2. MAIN ROUTE (Student & Jobs View) ---
app.get('/', (req, res) => {
    
    db.query('SELECT * FROM students', (err, studentsList) => {
        if (err) {
            console.error("Student Query Error:", err);
            return res.status(500).send("Database Error: " + err.message);
        }

        
        db.query('SELECT * FROM jobs', (err, jobsList) => {
            if (err) {
                console.error("Job Query Error:", err);
                return res.status(500).send("Database Error: " + err.message);
            }

            
            const firstStudent = studentsList.length > 0 ? studentsList[0] : { name: "Guest", cgpa: 0 };

            
            res.render('index', { 
                students: studentsList, // Poori list
                student: firstStudent,   // Header ke liye single object
                jobs: jobsList           // Jobs card dikhane ke liye
            });
        });
    });
});

// --- 3. ADMIN ROUTE ---
app.get('/admin', (req, res) => {
    db.query('SELECT * FROM applications', (err, results) => {
        if (err) return res.send("Admin Error");
        res.render('admin', { applications: results });
    });
});

// --- SERVER START ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is flying at http://localhost:${PORT}`);
>>>>>>> 3521869acb0d942a193fec9276ef526cc03d73bb
});