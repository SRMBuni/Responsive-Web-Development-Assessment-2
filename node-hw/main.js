#!/usr/bin/node
const exp = require('express');
const path = require('path');
const app = exp();

app.set('view engine', 'ejs');

// This ensures CSS/Images are served correctly from the 'static' folder
app.use(exp.static(path.join(__dirname, 'static')));

async function getRecipe(url) {
    try {
        const r = await fetch(url);
        if (!r.ok) return null;
        return await r.json();
    } catch (e) {
        console.error("API Fetch Error:", e);
        return null;
    }
}

/* Home Page */
app.get('/', (req, res) => {
    // We pass null for both so the EJS knows nothing has happened yet
    res.render('index', { meal: null, error: null });
});

/* Search Results */
app.get('/recipe', async (req, res) => {
    const s = req.query;
    
    // Safety check: if search is empty, just go home
    if (!s.q) return res.redirect('/');

    const u = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + s.q;
    const j = await getRecipe(u);

    if (j && j.meals) {
        console.log("[ ] Found:", j.meals[0].strMeal);
        res.render('index', { 
            meal: j.meals[0], 
            error: null 
        });
    } else {
        console.log("[!] No results found for:", s.q);
        res.render('index', { 
            meal: null, 
            error: `Sorry, we couldn't find any recipes for "${s.q}".` 
        });
    }
});

/* Random Recipe */
app.get('/lucky', async (req, res) => {
    const u = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const j = await getRecipe(u);

    if (j && j.meals) {
        console.log("[ ] Lucky find:", j.meals[0].strMeal);
        res.render('index', { 
            meal: j.meals[0], 
            error: null 
        });
    } else {
        res.render('index', { 
            meal: null, 
            error: "The kitchen is closed! Try again in a second." 
        });
    }
});

app.listen(3000, () => {
    console.log('Server is cooking at http://127.0.0.1:3000/');
});