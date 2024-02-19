const express = require('express');
const sass = require('sass');
const fs = require('fs');
const marked = require('marked');
const app = express();
const port = 3000;

const allLinks = [
    {
        paramId: "kilian-valkhof",
        link: "public/blogs/kilian-valkhof.md"
    },
    {
        paramId: "fenna-de-wilde",
        link: "public/blogs/fenna-de-wilde.md"
    },
    {
        paramId: "reflectie-1",
        link: "public/blogs/reflectie-1.md"
    },
]


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

// Define a route with a dynamic :id parameter
app.get("/blog/:id", async function (req, res) {
    try {
        const id = req.params.id;
        let html;

        for (const item of allLinks) {
            if (id === item.paramId && !item.link.startsWith("http")) {
                html = await parseToHTML(item.link);
            } else if (id === item.paramId) {
                html = await parseHTTPmdToHTML(item.link);
            }
        }

        if (!html) {
            console.log("notFound");
            res.status(404).render(notFoundPage);
            return;
        } 

        // Render the EJS template with the HTML content
        res.render("single", { html: html });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error reading file");
    }
});

// Parse local Markdown file to HTML
const parseToHTML = (markdownFile) => {
    return new Promise((resolve, reject) => {
        fs.readFile(markdownFile, "utf8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                reject(err);
            } else {
                const html = marked(data);
                resolve(html);
            }
        });
    });
};

// Parse remote Markdown file to HTML
const parseHTTPmdToHTML = async (url) => {
    try {
        const response = await axios.get(url);
        const html = marked(response.data);
        return html;
    } catch (error) {
        console.error("Error fetching file:", error);
        throw error;
    }
};



// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
