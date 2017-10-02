const express = require ('express');
const hbs = require ('hbs');
const fs = require ('fs');

var app = express();
var maintenance = false;

const port = process.env.PORT || 3000;

hbs.registerPartials(__dirname + "/views/partials");

app.set('view engine', 'hbs');

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('myServerLog.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append log to file');
    }
  });
  next();
});

app.use((req, res, next) => {
  if (maintenance)
    res.render('maintenance.hbs');
  else
    next();
});

app.use(express.static (__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (textToScream) => {
  return textToScream.toUpperCase();
});


app.get('/', (req, res) => {
  //res.send ('<H1>Hello Express<H1>');
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    pageOwner: 'Nikhil',
    age: 41,
    likes: [
      "Gym",
      "Activities with Naysha"
    ]
  })
});

app.get('/about', (req, res) => {
  res.render ('about.hbs', {
    pageTitle: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send ({
    errorCode: 'UNABLE_TO_SERVICE_REQUEST',
    errorCode: 'Unable to service the request at this time.'
  });
});


app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
