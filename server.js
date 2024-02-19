const express = require('express');
const sass = require('sass');
const fs = require('fs');
const path = require('path');
const marked = require('marked');

const app = express();
const port = 3000;
const publicDir = path.join(__dirname, 'public');
const blogsDir = path.join(__dirname, 'blogs');

// Compile Sass
function compileSass() {
    sass.render({
        file: path.join(publicDir, 'styles', 'index.scss'),
        outputStyle: 'compressed'
    }, function(err, result) {
        if (err) {
            console.error('Error compiling Sass:', err);
            return;
        }
        fs.writeFile(path.join(publicDir, 'styles', 'index.css'), result.css, function(err) {
            if (err) {
                console.error('Error writing CSS:', err);
            } else {
                console.log('Sass compiled successfully');
            }
        });
    });
}
compileSass();

// Watch Markdown files for changes
fs.watch(blogsDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
        console.log(`File ${filename} changed, reloading Markdown content...`);
        // Optionally reload the Markdown content here
    }
}).on('error', (error) => {
    if (error.code === 'ENOENT') {
        console.log(`Directory ${blogsDir} does not exist.`);
        // Handle this case accordingly, e.g., create the directory
    } else {
        console.error('Error watching directory:', error);
    }
});


app.use(express.static(publicDir));
app.set('view engine', 'ejs');

// Read Markdown file
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

// Routes
app.get('/', (req, res) => {
    res.render('pages/index');
});

app.get('/single', (req, res) => {
    res.render('pages/single');
});

app.get('/blog/:id', (req, res) => {
    const { id } = req.params;
    const markdownPath = path.join(blogsDir, `${id}.md`);

    readMarkdownFile(markdownPath, (err, data) => {
        if (err) {
            res.status(404).send('Blog not found');
            return;
        }
        const htmlContent = marked(data);
        res.render('pages/single', { content: htmlContent });
    });
});

// Watch Markdown files for changes
fs.watch(blogsDir, { recursive: true }, (eventType, filename) => {
    if (filename && filename.endsWith('.md')) {
        console.log(`File ${filename} changed, reloading Markdown content...`);
        // Optionally reload the Markdown content here
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
