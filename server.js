// Bron Setu-up: https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application
const express = require('express');

const sass = require('sass');
const fs = require('fs');

const app = express();
const port = 4000;

sass.render({
    file: 'public/styles/style.scss',
    outputStyle: 'compressed' // Set output style, e.g., compressed, expanded
}, function(err, result) {
    if (!err) {
        fs.writeFile('public/styles/style.css', result.css, function(err){
            if(!err){
                console.log('Sass compiled successfully');
            } else {
                console.error('Error writing CSS: ', err);
            }
        });
    } else {
        console.error('Error compiling Sass: ', err);
    }
});

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

// Port
app.listen(port, () => {
    console.log(`EServer is listening on port ${port}`);
});