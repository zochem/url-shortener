const express = require('express');
const exphbs = require('express-handlebars');
require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const shortUrlController = require('./controller/shortUrl');
const shortUrl = require('./models/shortUrl');

const port = process.env.PORT || 3080; 


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('static'));

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname:'.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts'),
}));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'views'));

app.get('/', (req,res) => {
     return res.redirect('/shorturl');    
})

app.use('/shorturl', shortUrlController);

app.listen(port, () => {
    console.log(`Server is listening on ${port}`)
})