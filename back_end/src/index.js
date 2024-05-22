import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { connectToDb } from '../db/db.js';
import userRouting from './routing/user.routing.js'
import wiki from 'wikipedia';

const app = express();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(cors({
    origin: process.env.FRONT_END_PORT_URL3000
}));

connectToDb((db, err) => {
    if (!err) {
        app.listen(process.env.BACK_END_LISTEN_PORT, () => {
            console.log(`App listening on Port ${process.env.BACK_END_LISTEN_PORT}`);
        });
        userRouting(app, db);
    } else {
        console.log('Could not connect to db');
    }
});



app.get('/', (req, res) => {
    res.send('Hello World');
});



app.get('/homepageCarousel', (req, res) => {
    res.send('FetchedCarouselHere');
});



app.post('/testSummary', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery;
        const language = await wiki.setLang('it');
        const page = await wiki.page(searchQuery);

        const summary = await page.summary();
        res.status(200).json(summary)

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Page Not Found" })
    }
})

app.post('/testCompleteArticle', async (req, res) => {
    try {
        const searchQuery = req.body.searchQuery ? req.body.searchQuery : req.body.suggestion;

        console.log("Search Query", searchQuery);

        if (searchQuery !== undefined) {

            const language = await wiki.setLang('it');
            const searchResults = await wiki.search(searchQuery, {limit: 5});


            console.log(searchResults);

            res.status(200).json(searchResults)

            return
        }

        res.status(404).json({ message: "Page Not Found" })

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Page Not Found" })
    }
})

app.get('/testDailyArticle', async (req, res) => {
    try {

        const language = await wiki.setLang('it');

        const dailyResults = await wiki.onThisDay();

        console.log(dailyResults);

        res.status(200).json(dailyResults)

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Page Not Found" })
    }
})
