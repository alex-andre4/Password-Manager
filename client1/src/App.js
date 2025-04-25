import './App.css';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import React from 'react';

function App() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [passwordList, setPasswordList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // Track the search input
  const [copiedId, setCopiedId] = useState(null); // Track which password was copied
  const [revealedPasswords, setRevealedPasswords] = useState({}); // Track revealed passwords

  useEffect(() => {
    Axios.get('http://localhost:3001/getpasswords').then((response) => {
      setPasswordList(response.data);
    });
  }, []);

  const addPassword = () => {
    Axios.post('http://localhost:3001/addpassword', {
      password: password,
      title: title,
    }).then(() => {
      window.location.reload(); // Reload to fetch updated passwords
    });
  };

  const deletePassword = (id) => {
    if (window.confirm('Are you sure you want to delete this password?')) {
      Axios.post('http://localhost:3001/deletepassword', { id }).then(() => {
        setPasswordList(passwordList.filter((val) => val.id !== id));
      });
    }
  };

  const decryptPassword = (encryption) => {
    if (revealedPasswords[encryption.id]) {
      setRevealedPasswords((prev) => ({ ...prev, [encryption.id]: false }));
    } else {
      Axios.post('http://localhost:3001/decryptpassword', {
        password: encryption.password,
        iv: encryption.iv,
      }).then((response) => {
        setPasswordList(
          passwordList.map((val) => {
            return val.id === encryption.id
              ? {
                  ...val,
                  decryptedPassword: response.data,
                }
              : val;
          })
        );
        setRevealedPasswords((prev) => ({ ...prev, [encryption.id]: true }));
      });
    }
  };

  const copyToClipboard = (id) => {
    const passwordEntry = passwordList.find((val) => val.id === id);

    if (passwordEntry) {
      if (passwordEntry.decryptedPassword) {
        navigator.clipboard.writeText(passwordEntry.decryptedPassword);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } else {
        Axios.post('http://localhost:3001/decryptpassword', {
          password: passwordEntry.password,
          iv: passwordEntry.iv,
        }).then((response) => {
          navigator.clipboard.writeText(response.data);
          setCopiedId(id);
          setTimeout(() => setCopiedId(null), 2000);
        });
      }
    }
  };

  return (
    <div className="App">
      <h1>Password Manager</h1>
      <div className="AddPassword">
        <input
          type="text"
          placeholder="Ex. password123"
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Ex. Facebook"
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        <button onClick={addPassword}>Add Password</button>
      </div>

      {/* Search Bar */}
      <div className="SearchBar">
        <input
          type="text"
          placeholder="Search by title..."
          onChange={(event) => setSearchTerm(event.target.value.toLowerCase())}
        />
      </div>

      <div className="Passwords">
        {passwordList
          .filter((val) => val.title.toLowerCase().includes(searchTerm)) // Filter passwords by search term
          .map((val, key) => {
            return (
              <div className="password" key={key}>
                <span>{val.title}</span>
                <span className="password-text">
                  {revealedPasswords[val.id] ? val.decryptedPassword || '******' : '******'}
                </span>
                {copiedId === val.id && <div className="copied-bubble">Copied!</div>}
                <div className="button-group">
                  <button
                    className="trash-button"
                    onClick={() => deletePassword(val.id)}
                  >
                    🗑️
                  </button>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(val.id)}
                  >
                    Copy
                  </button>
                  <button
                    className="reveal-button"
                    onClick={() =>
                      decryptPassword({
                        password: val.password,
                        iv: val.iv,
                        id: val.id,
                      })
                    }
                  >
                    {revealedPasswords[val.id] ? 'Hide' : 'Reveal'}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
