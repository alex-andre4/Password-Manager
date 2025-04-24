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
  res.send(decrypt(req.body));

})

app.listen(PORT, () => {
  console.log("Server is running");
});
