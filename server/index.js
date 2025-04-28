const express = require('express') ;
const app = express();
const PORT = 3001;
const mysql = require('mysql');
const cors = require('cors'); // import cors

const { encrypt , decrypt } = require('./encryptionHandler'); // import encryption handler

app.use(cors());
app.use(express.json()); // parse json data

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  database: 'passwordmanager',
  password: 'root',
});

// recieve password from the front end
app.post("/addpassword", (req, res) => {
  const {password, title} = req.body; // destructure password and title from request body
  const hashedPassword = encrypt(password); // encrypt password

    db.query(
      "INSERT INTO passwords (password, title, iv) VALUES (?, ?, ?)", 
      [hashedPassword.password, title, hashedPassword.iv], // insert encrypted password and title into database
       (err, result) => {
      if (err) {
        console.error(err);
      } else {
        res.send("Success");
      }
     }
    );
});

app.get('/getpasswords', (req, res) => {
  db.query("SELECT * FROM passwords", (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/decryptpassword', (req, res) => {
  const { password, iv } = req.body;

  try {
    const decryptedPassword = decrypt({ password, iv });
    res.send(decryptedPassword);
  } catch (error) {
    console.error('Error decrypting password:', error);
    res.status(500).send('Failed to decrypt password');
  }
});

app.post('/deletepassword', (req, res) => {
  const { id } = req.body;
  db.query('DELETE FROM passwords WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
    } else {
      res.send('Password deleted successfully');
    }
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE user = ?",
    [username],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server error");
      } else if (results.length === 0) {
        res.status(401).send({ message: "Invalid username or password" });
      } else {
        const user = results[0];
        const decryptedPassword = decrypt({
          password: user.password,
          iv: user.iv,
        });

        if (decryptedPassword === password) {
          res.send({ message: "Login successful", userId: user.idusers });
        } else {
          res.status(401).send({ message: "Invalid username or password" });
        }
      }
    }
  );
});

app.listen(PORT, () => {
  console.log("Server is running");
});
