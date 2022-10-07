const pgp = require('pg-promise');
const pool = require('./pool');
const tagRepo = require('./tag.repository');

class RecipeRepository {
    async getRecipes(username, page) {
        const getRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, picture FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id 
        WHERE username = $1
        ORDER BY rr.id ASC
        LIMIT 12 OFFSET $2 * 12;`;
        let result = await pool.query(getRecipesQuery, [username, page]);
        return await this.addTags(result);
    }
    async getCount(username) {
        const getCountQuery = `SELECT COUNT(*) FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id
        WHERE username = $1;`;
        let result = await pool.query(getCountQuery, [username]);
        return Number(result[0].count);
    }
    async getLastRecipes(username) {
        const getLastRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, picture FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id
        WHERE username = $1
        ORDER BY letrehozas_datuma DESC
        LIMIT 3;`;
        let result = await pool.query(getLastRecipesQuery, [username]);
        return await this.addTags(result);
    }
    async addTags(recipes) {
        return await Promise.all(recipes.map( async (recipe) => {
            recipe.tags = await tagRepo.getRecipeTags(recipe.id)
            return recipe;
        }));
    }
    async searchRecipes(username, page, text, time, tags) {
        let searchRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, picture FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id`;
        if(tags) {
           searchRecipesQuery += ` INNER JOIN (
            SELECT recipe_id, COUNT(tag_id) FROM recipebook_recipe_tag_kapcsolat
            WHERE tag_id IN (${tags})
            GROUP BY recipe_id HAVING COUNT(tag_id) = ${tags.length}
            ) tags ON tags.recipe_id = rr.id`;
        }
        searchRecipesQuery += ` WHERE username = $1`;
        if(text) {
            searchRecipesQuery += ` AND UPPER(title) LIKE UPPER('%${text}%')`;
        }
        if(time) {
            searchRecipesQuery += ` AND elkeszitesi_ido <= ${time}`;
        }
        searchRecipesQuery += ` ORDER BY rr.id ASC
            LIMIT 12 OFFSET $2 * 12;`;
        let result = await pool.query(searchRecipesQuery, [username, page]);
        return await this.addTags(result);
    }
    async selectedRecipesCount(username, text, time, tags) {
        let selectedRecipesCountQuery = `SELECT COUNT(*) FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id`;
        if(tags) {
            selectedRecipesCountQuery += ` INNER JOIN (
            SELECT recipe_id, COUNT(tag_id) FROM recipebook_recipe_tag_kapcsolat
            WHERE tag_id IN (${tags})
            GROUP BY recipe_id HAVING COUNT(tag_id) = ${tags.length}
            ) tags ON tags.recipe_id = rr.id`;
        }
        selectedRecipesCountQuery += ` WHERE username = $1`;
        if(text) {
            selectedRecipesCountQuery += ` AND title LIKE '%${text}%'`;
        }
        if(time) {
            selectedRecipesCountQuery += ` AND elkeszitesi_ido <= ${time}`;
        }
        let result = await pool.query(selectedRecipesCountQuery, [username]);
        return result[0].count;
    }
    async getSingleRecipe(recipeId) {
        let getSingleRecipeQuery = `SELECT * FROM recipebook_recipes WHERE id = $1;`;
        let result = await pool.one(getSingleRecipeQuery, [recipeId]);
        return result;
    }
    async getSingleRecipeTags(recipeId) {
        let getSingleRecipeTagsQuery = `SELECT tag_id, title FROM recipebook_recipe_tag_kapcsolat kapcs
        INNER JOIN recipebook_tags rt ON rt.id = kapcs.tag_id
        WHERE recipe_id = $1;`;
        let result = await pool.query(getSingleRecipeTagsQuery, [recipeId]);
        return result;
    }
    async deleteSingleRecipe(recipeId) {
        let deleteSingleRecipeKapcsolatQuery = `delete from recipebook_recipe_tag_kapcsolat where recipe_id = $1;`;
        let deleteSingleRecipeQuery = `DELETE FROM recipebook_recipes WHERE id = $1;`;
        await pool.tx(async (t) => {
            await t.query(deleteSingleRecipeKapcsolatQuery, [recipeId]);
            await t.query(deleteSingleRecipeQuery, [recipeId]);
        });
    }
    async saveRecipe(username, newRecipe, tagIds) {
        let ingredients = newRecipe.ingredientsList.join(',');
        let saveRecipeQuery = `INSERT INTO recipebook_recipes(id, title, user_id, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod)
        VALUES(nextval('s_recipebook_recipes'), $1, (select id from recipebook_user
        WHERE username = $2), $3, current_timestamp, $4, $5) returning id;`;
        let saveNewKapcsolatQuery = new pgp.QueryFile('../model/queries/insertKapcsolat.sql');
        let result;
        await pool.tx(async (t) => {
            result = await t.one(saveRecipeQuery, [newRecipe.recipeTitle, username, newRecipe.recipeTime, ingredients, newRecipe.elkeszites]);
            tagIds.forEach( async (tagId) => {
                await t.query(saveNewKapcsolatQuery, [result.id, tagId]);
            });
        });
        return result.id;
    }

    async addRecipeImage(recipeId, recipeImage) {
        let addRecipeImageQuery = `UPDATE recipebook_recipes SET picture = $2
                                WHERE id = $1`;
        await pool.query(addRecipeImageQuery, [recipeId, recipeImage]);
    }

    async updateRecipe(recipe) {
        let ingredients = recipe.ingredientsList.join(',');
        let updateRecipeQuery = `UPDATE recipebook_recipes
        SET title = $1, elkeszitesi_ido = $2, hozzavalok = $3, elkeszitesi_mod = $4
        WHERE id = $5`;
        await pool.query(updateRecipeQuery, [recipe.recipeTitle,
                                            recipe.recipeTime,
                                            ingredients,
                                            recipe.elkeszites,
                                            recipe.recipeId]);
    }

}

module.exports = new RecipeRepository();