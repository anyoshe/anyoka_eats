require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const routes = require('./routes/routes.js'); 
const appRoutes = require('./routes/appRouter.js');
const bodyParser = require('body-parser');

const app = express();
const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString);
const database = mongoose.connection;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Passport Configuration
passport.use(new LocalStrategy(
  { usernameField: 'contactNumber' },
  async (username, password, done) => {
    try {
      const partner = await Partner.findOne({ contactNumber: username });
      if (!partner) return done(null, false);
      const match = await bcrypt.compare(password, partner.password);
      if (!match) return done(null, false);
      return done(null, partner); 
    } catch (err) {
      return done(err);
    }
  }
));

// Session Configuration
app.use(session({
  secret: JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api', routes);
app.use('/api', appRoutes);

// File Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, '/var/data/uploads')));
// Serve static files from the persistent disk
app.use('/uploads/images', express.static(path.join('/var/data/uploads/images')));
app.use('/uploads/profile-images', express.static(path.join('/var/data/uploads/profile-images')));
app.use('/uploads/conferences', express.static(path.join('/var/data/uploads/conferences')));
// Serve static files from the "public" directory
// app.use(express.static(path.join(__dirname, '../client/public')));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../client/build')));


// The "catchall" handler: for any request that doesn't
// match one above, send back index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html')); // Adjusted path
});

// Error Handler
function errorHandler(err, req, res, next) {
  console.error(err.stack); 
  const statusCode = err.status || 500; 
  res.status(statusCode).json({ message: err.message });
}

app.use(errorHandler);

// CORS Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  next();
});

// Database Connection Events
database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});


