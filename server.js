var express = require('express');
var app = express();
var path = require('path');

// public files
app.use(express.static(path.join(__dirname, 'public')));

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page 
app.get('/', function(req, res) {
    res.render('pages/index');
});

// about page 
app.get('/compare', function(req, res) {
    res.render('pages/compare');
});

app.get('/pokedex', function(req, res) {
    res.render('pages/pokedex');
});

app.get('/pokedex_details', function(req, res) {
    res.render('pages/pokedex_details');
});

app.get('/pokemon_details', function(req, res) {
    res.render('pages/pokemon_details');
});

app.get('/random_pokemon', function(req, res) {
    res.render('pages/random_pokemon');
});

app.listen(8080);
console.log("Server running");
