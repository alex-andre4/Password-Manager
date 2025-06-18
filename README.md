🔐 Password Manager

A simple and secure web-based Password Manager built with Node.js, Express, MySQL, and React.
Safely store, view, and manage your passwords in an organized and encrypted system.

👉 View the Repository
🚀 Features

    Add, view, and manage saved passwords

    Organized password storage with easy access

    Backend built with Express and MySQL

    Frontend built with React

    Cross-Origin Resource Sharing (CORS) enabled

    Live reload during development with Nodemon

🛠️ Tech Stack

    Frontend: React, react-scripts

    Backend: Node.js, Express

    Database: MySQL

    Utilities: Nodemon, CORS

📦 Installation

    Clone the repository:

git clone https://github.com/alex-andre4/Password-Manager.git
cd Password-Manager

Install backend dependencies:

cd server
npm install

Install frontend dependencies:

cd ../client
npm install

Set up your MySQL database:

    Create a new MySQL database

    Update the database connection settings in your backend (e.g., server/index.js)

Start the development servers:

    Backend:

cd server
nodemon index.js

Frontend:

        cd ../client
        npm start

⚙️ Configuration

Make sure to configure your database credentials inside your backend code (server/index.js or similar).

Example:

const db = mysql.createConnection({
  host: 'localhost',
  user: 'your-username',
  password: 'your-password',
  database: 'your-database-name'
});

📂 Project Structure

Password-Manager/
├── client/          # React frontend
├── server/          # Node.js + Express backend
├── README.md
└── package.json

🧠 Future Improvements

    Add password encryption before storage

    Implement user authentication (login/register)

    Improve UI/UX design

    Add search and filtering for stored passwords

    Deploy to a public server

### 🎥 Demo Video

[![Watch the demo](https://img.youtube.com/vi/MJzk3ea2JlM/0.jpg)](https://youtu.be/MJzk3ea2JlM)

Pull requests are welcome! Feel free to open an issue or submit improvements and new features.
📜 License

This project is open source under the MIT License.
