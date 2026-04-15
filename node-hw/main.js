#!/usr/bin/node
const exp = require('express');
const fs = require('fs');
const path = require('path');
const app = exp();

app.set('view engine', 'ejs');
app.use(exp.static('static'));

async function getRecipe(url) {
    const r = await fetch(url);
    const d = await r.json();
    //console.log("object:", d);
    if (!r.ok) {
    return null;
    }
    return d;
}

/* home */
app.get('/', (req, res) => {
    //req.reqnder('index', {results: null});
    res.render('index', { results: null});
});

app.get('/recipe', async (req, res) => {
    const s = req.query;
    const u = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + s.q
    //const j = JSON.parse(fetch(u));
    const j = await getRecipe(u);

    m_id = j.meals[0].idMeal;
    m_name = j.meals[0].strMeal;
    m_cat = j.meals[0].strCategory;
    m_orig = j.meals[0].strArea;
    m_inst = j.meals[0].strInstructions;
    m_thumb = j.meals[0].strMealThumb;
    m_src = j.meals[0].strSource;
    
    console.log("[ ] found:", m_name);

    results = true;

    res.render('index', {});
    //res.render('index', {results: s.q });
});

app.get('/lucky', async (req, res) => {
    const u = 'https://www.themealdb.com/api/json/v1/1/random.php'
    const j = await getRecipe(u);

    m_id = j.meals[0].idMeal;
    m_name = j.meals[0].strMeal;
    m_cat = j.meals[0].strCategory;
    m_orig = j.meals[0].strArea;
    m_inst = j.meals[0].strInstructions;
    m_thumb = j.meals[0].strMealThumb;
    m_src = j.meals[0].strSource;
    
    console.log("[ ] found:", m_name);

    results = true;

    res.render('index', {});
});

app.listen(3000);
console.log('listening on http://127.0.0.1:3000/');
