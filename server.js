const express = require('express');
const sass = require('sass');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Function to compile Sass
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#7a7561db865749019571f89bbc464bca
function compileSass() {
    sass.render({
        file: 'public/styles/index.scss',
        outputStyle: 'compressed' // Set output style, e.g., compressed, expanded
    }, function(err, result) {
        if (!err) {
            fs.writeFile('public/styles/index.css', result.css, function(err){
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
}
compileSass();

fs.watch('public/styles', { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.scss')) {
        console.log(`File ${filename} changed, compiling Sass...`);
        compileSass();
    }
});

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/single', function(req, res) {
  res.render('pages/single');
});

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
