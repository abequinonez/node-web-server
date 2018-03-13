const express = require('express');
const app = express();
const hbs = require('hbs');
const fs = require('fs');

// Use port 3000 if no environment variable is set
const port = process.env.PORT || 3000;

// Register a partials directory
hbs.registerPartials(__dirname + '/views/partials');

// Set Handlebars as the default view engine
app.set('view engine', 'hbs');

// Create and use a middleware function that logs server requests
app.use((req, res, next) => {
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next();
});

/*
Create and use a middleware function that renders a maintenance page and
prevents any of the HTTP handlers below from running.
*/
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// Use a built-in middleware that sets up a static directory
app.use(express.static(__dirname + '/public'));

// Register a helper function that returns the current year
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// Register a helper function that converts a passed-in string to uppercase
hbs.registerHelper('screamIt', str => {
  return str.toUpperCase() + '!';
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg: 'Welcome to this brand new template page!'
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Projects Page',
    pageContent: 'This is the projects page.'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Error handling request'
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
