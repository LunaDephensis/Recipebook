const express = require('express');
const router = express.Router();
const recipeRepo = require('../model/recipe.repository');
const authService = require('../services/auth.services');

router.get('/', authService.verifyToken, async (req, res, next) => {
    let page = 0;
    if(req.query.page) {
        page = req.query.page;
    }
    if(req.query.title || req.query.time || req.query.tags) {
        let tags = req.query.tags;
        if(tags) {
            tags = tags.split(',');
        }
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
    await recipeRepo.saveRecipe(req.username, req.body);
    res.sendStatus(200);
});

router.delete('/recipe', authService.verifyToken, async (req, res, next) => {
    await recipeRepo.deleteSingleRecipe(req.query.id);
    res.sendStatus(200);
});

module.exports = router;