const express = require('express');
const sass = require('sass');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const allLinks = [
    {
        paramId: "1",
        link: "public/blogs/1.md"
    }, 
    {
        paramId: "2",
        link: "public/blogs/2.md"
    }, 
    {
        paramId: "3",
        link: "public/blogs/3.md"
    }
]

// Function to compile Sass
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

// Function to read Markdown file
function readMarkdownFile(filename, callback) {
    fs.readFile(filename, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Markdown file:', err);
            callback(err);
            return;
        }
        callback(null, data);
    });
}

app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res) {
    res.render('pages/index');
});

// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#5528358b478e4056a507c5e7d72a85bb
app.get('/:id', (req, res) => {
    const { id } = req.params;
    const link = allLinks.find(item => item.paramId === id);

    if (!link) {
        res.status(404).send('Blog not found');
        return;
    }

    const markdownPath = path.join(__dirname, link.link);

    fs.readFile(markdownPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Markdown file:', err);
            res.status(500).send('Error reading blog content');
            return;
        }
        res.render('pages/single', {
            data
        });
    });
});

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
