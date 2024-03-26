// Import required Node.js modules
const path = require('path'); // Module for working with file and directory paths
const express = require('express'); // Web application framework for Node.js
const session = require('express-session'); // Session middleware for Express
const routes = require('./controllers'); // Import custom route handlers
require('dotenv').config(); // Load environment variables from a .env file

// Import Sequelize and create a connection to the database
const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Create an instance of the Express application
const app = express();
const PORT = process.env.PORT || 3001; // Set the port for the application

// Configuration for session handling
const sess = {
  secret: process.env.SESSION_SECRET, // Secret key for session encryption
  cookie: {
    maxAge: 86400000, // Session expiration time in milliseconds (24 hours)
    httpOnly: true, // Session cookie is not accessible via client-side JavaScript
    secure: false, // Only send the cookie over HTTPS if secure is set to true
    sameSite: 'strict', // Cookie is only sent in a first-party context
  },
  resave: false, // Do not save the session if it wasn't modified
  saveUninitialized: true, // Save new sessions even if they haven't been modified
  store: new SequelizeStore({
    db: sequelize // Store sessions in the Sequelize database
  })
};

const cors = require('cors');
app.use(cors());

// Use the session middleware with the defined configuration
app.use(session(sess));

// Set up middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the defined routes for the application
app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Synchronize the Sequelize models with the database and start the Express server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}!`));
});
  
// ------------------------------------------------------------

// const express = require('express');
// const path = require('path');
// const db = require('./config/connection');
// const routes = require('./routes');

// const app = express();
// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // if we're in production, serve client/build as static assets
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.join(__dirname, '../client/build')));
// }

// app.use(routes);

// db.once('open', () => {
//   app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
// });
