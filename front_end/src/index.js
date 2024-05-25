import express from 'express';

const app = express();

app.use(express.static('public'));

app.set('view engine',  'ejs');


// Landing
app.get('/', (req, res) => {
    res.render('pages/landing_page')
});


// Homepage
app.get('/homepage', (req, res) => {
    res.render('pages/homepage')
});


// Wiki-Search
app.get('/search', (req, res) => {
    res.render('pages/wiki-search')
});

// Test Bro
app.get('/homebro', (req, res) => {
    res.render('pages/homebro')
});

app.listen(3000);