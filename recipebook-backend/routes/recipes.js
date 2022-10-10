const express = require('express');
const router = express.Router();
const recipeRepo = require('../model/recipe.repository');
const kapcsolatRepo = require('../model/kapcsolat.repository');
const authService = require('../services/auth.services');
const pool = require('../model/pool');
const upload = require('../services/upload.services');

router.get('/', authService.verifyToken, async (req, res, next) => {
    let page = 0;
    if(req.query.page) {
        page = req.query.page;
    }
    if(req.query.title || req.query.time || req.query.tags) {
        let tags = req.query.tags?.split(',');
        let recipes = await recipeRepo.searchRecipes(req.username, page, req.query.title, req.query.time, tags);
        let count = await recipeRepo.selectedRecipesCount(req.username, req.query.title, req.query.time, tags);
        res.json({
            recipes: recipes,
            count: count
        });
    }
    else {
        let recipes = await recipeRepo.getRecipes(req.username, page);
        let count = await recipeRepo.getCount(req.username);
        res.json({
            recipes: recipes,
            count: count
        });
    }
    
});

router.get('/lastrecipes', authService.verifyToken, async (req, res, next) => {
    let lastRecipes = await recipeRepo.getLastRecipes(req.username);
    res.json(lastRecipes);
});

router.get('/totalCount', authService.verifyToken, async (req, res, next) => {
    let count = await recipeRepo.getCount(req.username);
    res.json({
        count: count
    });
});

router.get('/singleRecipe', authService.verifyToken, async (req, res, next) => {
    let recipe = await recipeRepo.getSingleRecipe(req.query.id);
    let tags = await recipeRepo.getSingleRecipeTags(req.query.id);
    res.json({
        recipe: recipe,
        tags: tags
    });
});

router.post('/recipe', authService.verifyToken, async (req, res, next) => {
    try {
        let newRecipeId = await recipeRepo.saveRecipe(req.username, req.body.newRecipe, req.body.newRecipeTags);
        res.json({recipeId: newRecipeId});
    }
    catch(ex) {
        res.sendStatus(500);
    }
});

router.delete('/recipe', authService.verifyToken, async (req, res, next) => {
    try {
        await recipeRepo.deleteSingleRecipe(req.query.id);
        res.sendStatus(200);
    }
    catch(ex) {
        console.error(ex.message)
        res.sendStatus(500);
    }
});

router.put('/recipe', authService.verifyToken, async (req, res, next) => {
    try {
        await recipeRepo.updateRecipe(req.body.recipe, req.body.tags);
        res.sendStatus(200);
    }
    catch(ex) {
        console.error(ex.message)
        res.sendStatus(500);
    }
});

router.post('/uploadimage', [authService.verifyToken, upload.single('recipeImage')], async (req, res, next) => {
    let recipe = await recipeRepo.getSingleRecipe(req.body.recipeId);
    if(recipe) {
        await recipeRepo.addRecipeImage(req.body.recipeId, req.file.filename);
        res.sendStatus(200);
    }
    else {
        res.sendStatus(404);
    }
    console.log(req.file.filename);
});

module.exports = router;