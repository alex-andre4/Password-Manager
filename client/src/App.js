import './App.css';
import { useState } from 'react';
import Axios from 'axios';
import React from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwords, setPasswords] = useState([]);
  const [newPassword, setNewPassword] = useState('');
  const [title, setTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState({});
  const [copiedPasswordId, setCopiedPasswordId] = useState(null);

  const login = () => {
    Axios.post('http://localhost:3001/login', {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.message === "Login successful") {
        setIsLoggedIn(true);
        fetchPasswords(); // Fetch passwords after login
      }
    }).catch((error) => {
      alert(error.response.data.message); // Show alert only for incorrect login
    });
  };

  const fetchPasswords = () => {
    Axios.get('http://localhost:3001/getpasswords')
      .then((response) => {
        setPasswords(response.data); // Update the state with the new password list
      })
      .catch((error) => {
        console.error('Error fetching passwords:', error);
      });
  };

  const addPassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      password: newPassword,
      title: title,
    })
      .then(() => {
        setNewPassword(''); // Clear the input field
        setTitle(''); // Clear the title field
        fetchPasswords(); // Refresh the password list
      })
      .catch((error) => {
        console.error('Error adding password:', error);
      });
  };

  const deletePassword = (id) => {
    Axios.post('http://localhost:3001/deletepassword', { id }).then(() => {
      fetchPasswords(); // Refresh the password list
    });
  };

  const toggleRevealPassword = (id) => {
    const passwordToDecrypt = passwords.find((p) => p.id === id);

    if (!revealedPasswords[id]) {
      Axios.post('http://localhost:3001/decryptpassword', {
        password: passwordToDecrypt.password,
        iv: passwordToDecrypt.iv,
      })
        .then((response) => {
          setRevealedPasswords((prev) => ({
            ...prev,
            [id]: response.data,
          }));
        })
        .catch((error) => {
          console.error('Error decrypting password:', error);
        });
    } else {
      setRevealedPasswords((prev) => ({
        ...prev,
        [id]: null,
      }));
    }
  };

  const copyToClipboard = (password, id) => {
    navigator.clipboard.writeText(password);
    setCopiedPasswordId(id); // Show the "Copied!" bubble
    setTimeout(() => setCopiedPasswordId(null), 2000); // Hide the bubble after 2 seconds
  };

  const filteredPasswords = passwords.filter((password) =>
    password.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isLoggedIn) {
    return (
      <div className="App">
        <div className="LoginContainer">
          <h1>Login</h1>
          <input
            type="text"
            placeholder="Username"
            className="LoginInput"
            onChange={(event) => setUsername(event.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="LoginInput"
            onChange={(event) => setPassword(event.target.value)}
          />
          <button className="LoginButton" onClick={login}>Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Welcome to the Password Manager</h1>
      <div className="AddPassword">
        <input
          type="text"
          placeholder="Website Name"
          onChange={(event) => setTitle(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>
      <div className="SearchBar">
        <input
          type="text"
          placeholder="Search passwords..."
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>
      <div className="Passwords">
        {filteredPasswords.map((password, index) => (
          <div key={index} className="password">
            <span>{password.title}</span>
            <span>
              {revealedPasswords[password.id]
                ? revealedPasswords[password.id]
                : '••••••••'}
            </span>
            <div className="button-group">
              <button
                className="reveal-button"
                onClick={() => toggleRevealPassword(password.id)}
              >
                {revealedPasswords[password.id] ? 'Hide' : 'Reveal'}
              </button>
              <button
                className="copy-button"
                onClick={() => copyToClipboard(revealedPasswords[password.id] || password.password, password.id)}
              >
                Copy
              </button>
              <button
                className="trash-button"
                onClick={() => deletePassword(password.id)}
              >
                Delete
              </button>
              {copiedPasswordId === password.id && (
                <div className="copied-bubble">Copied!</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
