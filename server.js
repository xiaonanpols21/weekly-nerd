const express = require('express');
const sass = require('sass');
const fs = require('fs');
const markdownIt = require('markdown-it');
const path = require('path');

const app = express();
const port = 3000;
const md = new markdownIt();

const allLinks = [
    {
        paramId: "1",
        slug: "phantom",
        title: "Phantom",
        date: "14-02-2024",
        authur: "Fenna de wilde",
        img: "/img/blogs/phantom.png",
        categories: ["NextJS", "JavaScript"],
        description: "Deep dive over aria-labels en een demonstratie over het maken van een carousel",
        link: "public/blogs/1.md"
    }, 
    {
        paramId: "2",
        slug: "stop-using-js-for-that",
        title: "Stop using JS for that",
        date: "07-02-2024",
        authur: "Kilian Valkhof",
        img: "/img/blogs/stop-js.jpeg",
        categories: ["HTML", "JavaScript", "CSS"],
        description: "Rule: Don't use JavaScript to do something you can easily achieve with CSS.",
        link: "public/blogs/2.md"
    }, 
    {
        paramId: "3",
        slug: "reflectie-1",
        title: "Reflectie 1",
        date: "16-02-2024",
        authur: "Xiao Nan Pols",
        img: "/img/blogs/reflectie.jpg",
        categories: ["Reflectie", "JavaScript", "CSS"],
        description: "Waar sta ik, wat wil ik leren en wat hoop ik te behalen",
        link: "public/blogs/3.md"
    },
    {
        paramId: "4",
        slug: "jeffry-arts",
        title: "Jeffry Arts",
        date: "21-02-2024",
        authur: "Jeffry Arts",
        img: "/img/blogs/jeffry-arts.png",
        categories: ["3d", "CSS"],
        description: "Jeffry zijn 3D model",
        link: "public/blogs/4.md"
    },
    {
        paramId: "5",
        slug: "9-elements",
        title: "9 Elements",
        date: "06-03-2024",
        authur: "Nils Binder",
        img: "/img/blogs/9-elements.jpeg",
        categories: ["columns", "CSS"],
        description: "Een verhaal over een holbewoner die moet gaan designen met columns",
        link: "public/blogs/5.md"
    },
    {
        paramId: "6",
        slug: "declarative-design",
        title: "Declarative design",
        date: "14-03-2024",
        authur: "Jeremy Keith",
        img: "/img/blogs/declarative-design.jpeg",
        categories: ["rem", "CSS", "JavaScript", "HTML"],
        description: "Imperative VS Declarative",
        link: "public/blogs/6.md"
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
    res.render('pages/index', {
        allLinks
    });
});

// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#5528358b478e4056a507c5e7d72a85bb
// Route handler for rendering individual blog pages
app.get('/blog/:slug', (req, res) => {
    const { slug } = req.params;
    const link = allLinks.find(item => item.slug === slug);

    if (!link) {
        res.status(404).send('Blog not found');
        return;
    }

    // Change string to date
    // Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#83f8f6ae239542c2a30756f1f6eae882
    const [day, month, year] = link.date.split('-');
    const formattedDate = new Date(`${year}-${month}-${day}`);
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDateString = formattedDate.toLocaleDateString('nl-NL', options);
    const markdownPath = path.join(__dirname, link.link);

    fs.readFile(markdownPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading Markdown file:', err);
            res.status(500).send('Error reading blog content');
            return;
        }
        
        const htmlContent = md.render(data);

        res.render('pages/single', {
            content: htmlContent,
            link: {
                ...link,
                date: formattedDateString
            }
        });
    });
});

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
