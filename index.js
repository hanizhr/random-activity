import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');

app.get("/", async (req, res) => {
    try {
        const response = await axios.get('https://bored-api.appbrewery.com/random');
        const result = response.data;
        res.render('index', { data: result, error: null }); 
    } catch (error) {
        console.log('failed to make request: ', error.message);
        res.render("index", { data: null, error: error.message }); 
    }
});

app.post('/', async (req, res) => {
    console.log(req.body);
    try {
        const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${req.body.type}&participants=${req.body.participants}`);
        const result = response.data;

        if (Array.isArray(result) && result.length > 0) {
            const randomActivity = result[Math.floor(Math.random() * result.length)];
            console.log(randomActivity);
            res.render('index', { data: randomActivity, error: null }); 
        } else {
            res.render('index', { data: null, error: "No activities found matching your criteria." });
        }

    } catch (error) {
        console.log('error: ', error.message);
        res.render('index', { data: null, error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
