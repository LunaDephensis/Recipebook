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
    let newRecipeId;
    pool.tx(async () => {
        newRecipeId = await recipeRepo.saveRecipe(req.username, req.body.newRecipe);
        await kapcsolatRepo.saveAllNewKapcsolat(newRecipeId, req.body.newRecipeTags);

    }).then(() => {
        res.json({recipeId: newRecipeId});
    });
});

router.delete('/recipe', authService.verifyToken, async (req, res, next) => {
    pool.tx(async () => {
        await kapcsolatRepo.deleteSingleRecipeKapcsolat(req.query.id);
        await recipeRepo.deleteSingleRecipe(req.query.id);
    }).then(() => {
        res.sendStatus(200);
    });
});

router.put('/recipe', authService.verifyToken, async (req, res, next) => {
    pool.tx( async () => {
        await recipeRepo.updateRecipe(req.body.recipe);
        let oldTags = await recipeRepo.getSingleRecipeTags(req.body.recipe.recipeId);
        let oldTagIds = oldTags.map((oldTag) => {
            return oldTag.tag_id;
        });
        let newTagIds = [];
        req.body.tags.forEach((tagId) => {
            if(!oldTagIds.includes(tagId)) {
                newTagIds.push(tagId);
            }
        });
        await kapcsolatRepo.saveAllNewKapcsolat(req.body.recipe.recipeId, newTagIds);
        oldTagIds = oldTagIds.filter((oldTagId) => {
            return !req.body.tags.includes(oldTagId);
        });
        await kapcsolatRepo.deleteOldTags(req.body.recipe.recipeId, oldTagIds);
    }).then(() => {
        res.sendStatus(200);
    });
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