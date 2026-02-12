<<<<<<< HEAD
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const app = express();

// 1. Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads')); // Isse uploaded resumes browse ho sakenge
app.use(session({
    secret: 'placement_secret',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

// 2. Database Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'placement_db',
    port: 3310
});

// 3. Resume Storage Setup (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- ROUTES ---
// SIGNUP PAGE (GET)
app.get('/signup', (req, res) => {
    res.render('signup');
});

// SIGNUP LOGIC (POST)
app.post('/signup', (req, res) => {
    const { name, email, cgpa, password } = req.body;
    
    // Naya student database mein insert karne ke liye
    const query = 'INSERT INTO students (name, email, cgpa, password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, cgpa, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error: Email might already be registered. <a href='/signup'>Try again</a>");
        }
        // Register hone ke baad direct login page par bhej dein
        res.send("<h1>✅ Registration Successful!</h1><p>You can now <a href='/login'>Login here</a></p>");
    });
});

// LOGIN PAGE
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (results.length > 0) {
            req.session.studentId = results[0].id; // Session mein ID save ho gayi
            res.redirect('/');
        } else {
            res.send("Invalid Login! <a href='/login'>Try again</a>");
        }
    });
});

// STUDENT PORTAL (Login Required)
app.get('/', (req, res) => {
    if (!req.session.studentId) return res.redirect('/login'); 
    db.query('SELECT * FROM students WHERE id = ?', [req.session.studentId], (err, sResult) => {
        db.query('SELECT * FROM jobs', (err, jResult) => {
            res.render('index', { student: sResult[0], jobs: jResult });
        });
    });
});

// APPLY WITH RESUME 
app.post('/apply', upload.single('resume'), (req, res) => {
    const { student_id, job_id } = req.body;
    const resume_url = req.file ? req.file.filename : null;

    
    db.query('INSERT IGNORE INTO applications (student_id, job_id, status, resume_url) VALUES (?, ?, "Pending", ?)', 
    [student_id, job_id, resume_url], (err) => {
        
       
        if (err) {
            console.log("Database Error ignored for duplicate entry.");
        }
        
        
        res.send("<h1>✅ Application Submitted!</h1><p>our application has been submitted successfully!</p><a href='/'>Back to Portal</a>");
    });
});

// ADMIN PANEL
app.get('/admin', (req, res) => {
    const query = `
        SELECT a.id, s.name AS studentName, j.company AS companyName, a.status, a.resume_url 
        FROM applications a 
        JOIN students s ON a.student_id = s.id 
        JOIN jobs j ON a.job_id = j.id`;
    db.query(query, (err, results) => {
        if (err) return res.send(err.message);
        res.render('admin', { applications: results });
    });
});

// ADMIN ACTIONS (Approve/Reject)
app.post('/update-status', (req, res) => {
    const { app_id, status } = req.body;
    db.query('UPDATE applications SET status = ? WHERE id = ?', [status, app_id], () => {
        res.redirect('/admin');
    });
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

=======
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const session = require('express-session');
const app = express();

// 1. Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads')); // Isse uploaded resumes browse ho sakenge
app.use(session({
    secret: 'placement_secret',
    resave: false,
    saveUninitialized: true
}));
app.set('view engine', 'ejs');

// 2. Database Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '', 
    database: 'placement_db',
    port: 3310
});

// 3. Resume Storage Setup (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// --- ROUTES ---
// SIGNUP PAGE (GET)
app.get('/signup', (req, res) => {
    res.render('signup');
});

// SIGNUP LOGIC (POST)
app.post('/signup', (req, res) => {
    const { name, email, cgpa, password } = req.body;
    
    // Naya student database mein insert karne ke liye
    const query = 'INSERT INTO students (name, email, cgpa, password) VALUES (?, ?, ?, ?)';
    db.query(query, [name, email, cgpa, password], (err, result) => {
        if (err) {
            console.log(err);
            return res.send("Error: Email might already be registered. <a href='/signup'>Try again</a>");
        }
        // Register hone ke baad direct login page par bhej dein
        res.send("<h1>✅ Registration Successful!</h1><p>You can now <a href='/login'>Login here</a></p>");
    });
});

// LOGIN PAGE
app.get('/login', (req, res) => res.render('login'));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM students WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (results.length > 0) {
            req.session.studentId = results[0].id; // Session mein ID save ho gayi
            res.redirect('/');
        } else {
            res.send("Invalid Login! <a href='/login'>Try again</a>");
        }
    });
});

// STUDENT PORTAL (Login Required)
app.get('/', (req, res) => {
    if (!req.session.studentId) return res.redirect('/login'); 
    db.query('SELECT * FROM students WHERE id = ?', [req.session.studentId], (err, sResult) => {
        db.query('SELECT * FROM jobs', (err, jResult) => {
            res.render('index', { student: sResult[0], jobs: jResult });
        });
    });
});

// APPLY WITH RESUME 
app.post('/apply', upload.single('resume'), (req, res) => {
    const { student_id, job_id } = req.body;
    const resume_url = req.file ? req.file.filename : null;

    
    db.query('INSERT IGNORE INTO applications (student_id, job_id, status, resume_url) VALUES (?, ?, "Pending", ?)', 
    [student_id, job_id, resume_url], (err) => {
        
       
        if (err) {
            console.log("Database Error ignored for duplicate entry.");
        }
        
        
        res.send("<h1>✅ Application Submitted!</h1><p>our application has been submitted successfully!</p><a href='/'>Back to Portal</a>");
    });
});

// ADMIN PANEL
app.get('/admin', (req, res) => {
    const query = `
        SELECT a.id, s.name AS studentName, j.company AS companyName, a.status, a.resume_url 
        FROM applications a 
        JOIN students s ON a.student_id = s.id 
        JOIN jobs j ON a.job_id = j.id`;
    db.query(query, (err, results) => {
        if (err) return res.send(err.message);
        res.render('admin', { applications: results });
    });
});

// ADMIN ACTIONS (Approve/Reject)
app.post('/update-status', (req, res) => {
    const { app_id, status } = req.body;
    db.query('UPDATE applications SET status = ? WHERE id = ?', [status, app_id], () => {
        res.redirect('/admin');
    });
});

// LOGOUT
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

>>>>>>> 3521869acb0d942a193fec9276ef526cc03d73bb
app.listen(3000, () => console.log('🚀 Server is running at http://localhost:3000'));