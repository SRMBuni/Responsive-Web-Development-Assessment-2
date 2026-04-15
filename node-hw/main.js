#!/usr/bin/node
const exp = require('express');
const path = require('path');
const app = exp();

app.set('view engine', 'ejs');
// FIX: Using path.join ensures 'static' is found correctly
app.use(exp.static(path.join(__dirname, 'static')));

async function getRecipe(url) {
    const r = await fetch(url);
    if (!r.ok) return null;
    const d = await r.json();
    return d;
}

/* home */
app.get('/', (req, res) => {
    res.render('index', { results: false, error: false });
});

app.get('/recipe', async (req, res) => {
    const s = req.query;
    const u = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + s.q;
    const j = await getRecipe(u);

    // ERROR PREVENTION: Check if meals exist
    if (j && j.meals) {
        m_id = j.meals[0].idMeal;
        m_name = j.meals[0].strMeal;
        m_cat = j.meals[0].strCategory;
        m_orig = j.meals[0].strArea;
        m_inst = j.meals[0].strInstructions;
        m_thumb = j.meals[0].strMealThumb;
        m_src = j.meals[0].strSource;
        
        console.log("[ ] found:", m_name);
        res.render('index', { results: true, error: false });
    } else {
        console.log("[!] no results for:", s.q);
        res.render('index', { results: false, error: true, query: s.q });
    }
});

app.get('/lucky', async (req, res) => {
    const u = 'https://www.themealdb.com/api/json/v1/1/random.php';
    const j = await getRecipe(u);

    if (j && j.meals) {
        m_id = j.meals[0].idMeal;
        m_name = j.meals[0].strMeal;
        m_cat = j.meals[0].strCategory;
        m_orig = j.meals[0].strArea;
        m_inst = j.meals[0].strInstructions;
        m_thumb = j.meals[0].strMealThumb;
        m_src = j.meals[0].strSource;
        
        console.log("[ ] lucky find:", m_name);
        res.render('index', { results: true, error: false });
    } else {
        res.render('index', { results: false, error: true, query: "Random" });
    }
});

app.listen(3000);
console.log('listening on http://127.0.0.1:3000/');