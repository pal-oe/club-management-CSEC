const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Number of salt rounds for bcrypt hashing

const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
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
  connection.query("SELECT * FROM members WHERE name = ?", [username], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.redirect("/");
      return;
    }

    if (results && results.length > 0) {
      const storedPassword = results[0].user_pass;
      const role = results[0].role;

      bcrypt.compare(password, storedPassword, function(err, isMatch) {
        if (err) {
          console.error('Error comparing passwords:', err);
          res.redirect("/");
          return;
        }

        if (isMatch) {
          req.session.isAuthenticated = true;
          if (role === 'Admin') {
            res.redirect("/home");
          } else if (role === 'User') {
            res.redirect("/user");
          } 
        } else {
          res.redirect("/");
        }
        res.end();
      });
    } else {
      res.redirect("/");
    }
  });
});

// New route to fetch member data for editing
app.get("/members/:id/edit", function(req, res) {
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
        console.log("tree wedalo");
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
app.delete("/members/:id", function(req, res) {
  const memberId = req.params.id;
  connection.query("DELETE FROM members WHERE id = ?", [memberId], function(error, results, fields){
    if (error) {
      console.error('Error executing MySQL query:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Member not found' });
    } else {
      res.status(200).json({ message: 'Member deleted successfully' });
    }
  });
});


app.post('/edit/:id', (req, res) => {
  const memberId = req.params.id;
  const { name, status, role } = req.body;

  // Perform the database update operation
  connection.query(
    'UPDATE members SET name = ?, status = ?, role = ? WHERE id = ?',
    [name, status, role, memberId],
    (error, results) => {
      if (error) {
        console.error('Error updating member:', error);
        res.status(500).json({ message: 'Failed to update member' });
      } else {
        res.status(200).json({ message: 'Member updated successfully' });
      }
    }
  );
});
// Use the middleware for the "/home" route
app.get("/home", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/home.html");
});

app.get("/user", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/user.html");
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

  bcrypt.genSalt(saltRounds, function(err, salt) {
    if (err) {
      console.error('Error generating salt:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      bcrypt.hash(newMember.user_pass, salt, function(err, hash) {
        if (err) {
          console.error('Error hashing password:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          connection.query("INSERT INTO members (name, status, role, user_pass) VALUES (?, ?, ?, ?)", [newMember.name, newMember.status, newMember.role, hash], function(error, results, fields) {
            if (error) {
              console.error('Error executing MySQL query:', error);
              res.status(500).json({ error: 'Internal Server Error', details: error.message });
            } else {
              res.status(200).json({ message: 'Member added successfully' });
            }
          });
        }
      });
    }
  });
});
