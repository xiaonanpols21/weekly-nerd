const express = require('express');
const sass = require('sass');
const fs = require('fs');
const markdownIt = require('markdown-it');
const path = require('path');

const app = express();
const port = 4000;
const md = new markdownIt();

const allLinks = [
    {
        paramId: "1",
        slug: "phantom",
        title: "Phantom",
        date: "14-02-2024",
        authur: "Fenna de wilde",
        img: "/img/blogs/phantom.png",
        categories: ["JavaScript"],
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
        categories: ["CSS"],
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
        categories: ["CSS"],
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
        categories: ["CSS", "JavaScript", "HTML"],
        description: "Imperative VS Declarative",
        link: "public/blogs/6.md"
    },
    {
        paramId: "7",
        slug: "character-design",
        title: "Character design",
        date: "18-03-2024",
        authur: "Julia Miocene",
        img: "/img/blogs/character-css.jpeg",
        categories: ["CSS"],
        description: "How to make Characters with pure CSS animations",
        link: "public/blogs/7.md"
    },
    {
        paramId: "8",
        slug: "hackaton",
        title: "Hackaton",
        date: "28-03-2024",
        authur: "Xiao Nan Pols",
        img: "/img/blogs/hackaton-design.jpg",
        categories: ["Hackaton"],
        description: "Een week lang werken aan: CSS Day Hackaton",
        link: "public/blogs/8.md"
    },
    {
        paramId: "9",
        slug: "digitaal-toegankelijkheid",
        title: "Digitaal Toegankelijkheid",
        date: "03-04-2024",
        authur: "Pim en Marieke",
        img: "/img/blogs/digitaal-toegankelijkheid.png",
        categories: ["HTML"],
        description: "Hoe maak je het web toegankelijk voor iedereen?",
        link: "public/blogs/9.md"
    },
    {
        paramId: "10",
        slug: "creative-coding",
        title: "Creative Coding",
        date: "10-04-2024",
        authur: "Rosa Schuurman",
        img: "/img/blogs/creative-coding.jpg",
        categories: ["fysiek"],
        description: "Wat is cricuit bending?",
        link: "public/blogs/10.md"
    },
    {
        paramId: "11",
        slug: "reflectie-2",
        title: "Reflectie 2",
        date: "8-05-2024",
        authur: "Xiao Nan Pols",
        img: "/img/blogs/reflectie.jpg",
        categories: ["Reflectie", "JavaScript", "CSS"],
        description: "Waar sta ik nu, wat wil ik leren tijdens de Meesterproef?",
        link: "public/blogs/11.md"
    },
    {
        paramId: "12",
        slug: "aan-het-werk",
        title: "Aan het werk, wat nu?",
        date: "15-05-2024",
        authur: "Robert Spier",
        img: "/img/blogs/robert.jpeg",
        categories: ["fysiek"],
        description: "Waar moet je op letten als je gaat solliciteren en hoeveel geld kan je wel niet verdienen met een CMD diploma?",
        link: "public/blogs/12.md"
    },
    {
        paramId: "13",
        slug: "q-42",
        title: "Q 42",
        date: "22-05-2024",
        authur: "Q 42 medewerkers",
        img: "/img/blogs/q-42.png",
        categories: ["HTML", "CSS"],
        description: "Met welke projecten hebben wij toegankelijkheid toegevoegd?",
        link: "public/blogs/13.md"
    },
    {
        paramId: "14",
        slug: "public-stack",
        title: "Mobile ecosystem and the public stack",
        date: "29-05-2024",
        authur: "Danny en Marit",
        img: "/img/blogs/eco.png",
        categories: ["ecosystem"],
        description: "Hoe ziet jouw perfecte mobiel er uit?",
        link: "public/blogs/14.md"
    },
    {
        paramId: "15",
        slug: "pre-css-day",
        title: "Pre CSS day",
        date: "05-06-2024",
        authur: "Bramus en Miriam",
        img: "/img/blogs/pre-css.png",
        categories: ["CSS"],
        description: "View Trainsitions en Containers",
        link: "public/blogs/15.md"
    },
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
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#b0ebdf0e75f24fe99f9cea7d43f519f6
app.get('/', function(req, res) {
    // Extract query parameters from the request
    const { html, css, javascript, reflection, sort } = req.query;

    // Filter the allLinks array based on selected categories
    let filteredLinks = allLinks.filter(link => {
        if (html && !link.categories.includes('HTML')) return false;
        if (css && !link.categories.includes('CSS')) return false;
        if (javascript && !link.categories.includes('JavaScript')) return false;
        if (reflection && !link.categories.includes('Reflectie')) return false;
        return true;
    });

    // Sort the filtered array based on the selected sorting option
    // Sort the filtered array based on the selected sorting option
    if (sort === 'abc') {
        filteredLinks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'old') {
        filteredLinks.sort((a, b) => {
            const dateA = new Date(
                parseInt(a.date.substring(6, 10)), // year
                parseInt(a.date.substring(3, 5)) - 1, // month (zero-based)
                parseInt(a.date.substring(0, 2)) // day
            );
            const dateB = new Date(
                parseInt(b.date.substring(6, 10)), // year
                parseInt(b.date.substring(3, 5)) - 1, // month (zero-based)
                parseInt(b.date.substring(0, 2)) // day
            );
            return dateA - dateB;
        });
    } else if (sort === 'new') {
        filteredLinks.sort((a, b) => {
            const dateA = new Date(
                parseInt(a.date.substring(6, 10)), // year
                parseInt(a.date.substring(3, 5)) - 1, // month (zero-based)
                parseInt(a.date.substring(0, 2)) // day
            );
            const dateB = new Date(
                parseInt(b.date.substring(6, 10)), // year
                parseInt(b.date.substring(3, 5)) - 1, // month (zero-based)
                parseInt(b.date.substring(0, 2)) // day
            );
            return dateB - dateA;
        });
    }

    // Render the page with the filtered and sorted array
    res.render('pages/index', {
        allLinks: filteredLinks
    });
});


// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#5528358b478e4056a507c5e7d72a85bb
// Zie prompts: https://chemical-bunny-323.notion.site/Weekly-Nerd-Chat-GPT-Documentation-6764544211dc42158c23d85eec350fc4#ddb57851bec54566a74a963b47edc729
app.get('/blog/:slug', (req, res) => {
    const { slug } = req.params;
    const link = allLinks.find(item => item.slug === slug);

    if (!link) {
        res.status(404).send('Blog not found');
        return;
    }

    // Find the index of the current blog
    const currentIndex = allLinks.findIndex(item => item.slug === slug);

    // Extract the next three blogs after the current one
    const relatedBlogs = allLinks.slice(currentIndex + 1, currentIndex + 4);

    // Render the single blog page
    // Change string to date
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
            },
            relatedBlogs: relatedBlogs // Pass the related blogs to the template
        });
    });
});

// Port
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
