const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'newnode'
});

connection.connect(function (error) {
  if (error) {
    console.error('Error connecting to MySQL:', error.message);
  } else {
    console.log('Connected to the database successfully!');
  }
});

// Middleware to check if the user is authenticated
const authenticateUser = (req, res, next) => {
  // Check if the user is authenticated
  if (req.session.isAuthenticated) {
    return next();
  }

  // User is not authenticated, redirect to the login page
  res.redirect("/");
};

// Middleware to fetch members from the database
const fetchMembersMiddleware = (req, res, next) => {
  connection.query("SELECT * FROM members", function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Attach the fetched members to the request object
      req.membersData = results;
      next();
    }
  });
};

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  connection.query("SELECT * FROM loginuser WHERE user_name = ? AND user_pass = ?", [username, password], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.redirect("/");
      return;
    }

    if (results && results.length > 0){
      req.session.isAuthenticated = true;
      res.redirect("/home");
    } else {
      res.redirect("/");
    }
    res.end();
  });
});

// New route to fetch member data for editing
app.get("/members/:id/edit", authenticateUser, function(req, res) {
  const memberId = req.params.id;
  connection.query("SELECT * FROM members WHERE id = ?", [memberId], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        // Return the member data
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(results[0]);
      } else {
        // Member not found
        res.status(404).json({ error: 'Member not found' });
      }
    }
  });
});

app.post('/members/:id/edit', (req, res) => {
  const memberId = req.params.id;
  const { name, status, role } = req.body;
  connection.query('UPDATE your_table_name SET name=?, status=?, role=? WHERE id=?', [name, status, role, memberId], (error, results) => {
    if (error) throw error;
    res.sendStatus(200);
  });
});


// New route to handle member deletion
app.delete("/members/:id", authenticateUser, function(req, res) {
  const memberId = req.params.id;
  connection.query("DELETE FROM members WHERE id = ?", [memberId], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.status(200).json({ message: 'Member deleted successfully' });
    }
  });
});

// Existing code...

// Use the middleware for the "/home" route
app.get("/home", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/home.html");
});

// New route to serve members data as JSON
app.get("/members", fetchMembersMiddleware, function(req, res) {
  res.status(200).json(req.membersData);
});

app.listen(3600, () => {
  console.log('Server is listening on port 3600');
});
app.post("/add-member", function(req, res) {
  const newMember = req.body;

  connection.query("INSERT INTO members (name, status, role) VALUES (?, ?, ?)", [newMember.name, newMember.status, newMember.role], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    } else {
      res.status(200).json({ message: 'Member added successfully' });
    }
  });
});
