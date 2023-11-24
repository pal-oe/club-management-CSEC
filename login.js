const mysql = require('mysql2');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require("path");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const multer = require('multer'); // for handling file uploads
const storage = multer.memoryStorage(); // store uploaded files in memory as buffers
const upload = multer({ storage: storage });

const customFolderPath = path.join(__dirname, "static");
app.use(express.static(customFolderPath));
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
    console.log(req.session.isAuthenticatedreq);
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
app.post('/openMember', (req, res) =>{
  console.log("we are working");
  res.redirect('/members-database.html')
})
app.get("/members-database.html", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/members-database.html");
});
// Route to handle the form submission and insert data into the database
app.post('/postEvent', upload.single('eventImage'), (req, res) => {
  // Retrieve form values
  console.log("Received form data:", req.body);
  console.log("Received file:", req.file);
  const eventTitle = req.body.eventTitle;
  const eventDescription = req.body.eventDescription;
  const eventDate = req.body.eventDate;
  const eventTime = req.body.eventTime;
  const eventLocation = req.body.eventLocation;

  // Validate form fields
  if (!eventTitle || !eventDescription || !eventDate || !eventTime || !eventLocation || !req.file) {
      res.status(400).send("Please fill in all fields");
      return;
  }

  // Read the image file
  const imageBuffer = req.file.buffer;

  // Insert data into the database
  const sql = "INSERT INTO events (event_title, description, event_date, event_time, location, image_data) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(sql, [eventTitle, eventDescription, eventDate, eventTime, eventLocation, imageBuffer.toString('base64')], (error, results) => {
      if (error) {
          console.error(error);
          res.status(500).send("Internal Server Error");
          return;
      }

      res.status(200).send("Event successfully posted");
  });
});

app.get("/home", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/home.html");
});

app.get("/user", authenticateUser, fetchMembersMiddleware, function(req, res){
  res.sendFile(__dirname + "/user.html");
});

app.post('/logout', authenticateUser, (req, res) => {
  // Assuming you have a session variable named 'authenticated'
  req.session.authenticated = false;
  console.log("isfalse");
  // You can perform additional cleanup or redirection here if needed
  res.redirect('/');
});

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


app.get('/getEvents', (req, res) => {
  const sql = "SELECT id, event_title, description, event_date, event_time, location, image_data FROM events";
  connection.query(sql, (error, results) => {
      if (error) {
          console.error("Error fetching events:", error);
          res.status(500).send("Internal Server Error");
          return;
      }

      res.json(results);
  });
});

// Route to delete an event by ID
app.delete('/deleteEvent/:eventId', (req, res) => {
  const eventId = req.params.eventId;
  const sql = "DELETE FROM events WHERE id = ?";
  connection.query(sql, [eventId], (error, results) => {
      if (error) {
          console.error("Error deleting event:", error);
          res.status(500).send("Internal Server Error");
          return;
      }

      res.status(200).send("Event successfully deleted");
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
