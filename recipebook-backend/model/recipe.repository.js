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
        return await this.addTags(result.rows);
    }
    async getCount(username) {
        const getCountQuery = `SELECT COUNT(*) FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id
        WHERE username = $1;`;
        let result = await pool.query(getCountQuery, [username]);
        return Number(result.rows[0].count);
    }
    async getLastRecipes(username) {
        const getLastRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, picture FROM recipebook_recipes rr
        INNER JOIN recipebook_user ru ON ru.id = rr.user_id
        WHERE username = $1
        ORDER BY letrehozas_datuma DESC
        LIMIT 3;`;
        let result = await pool.query(getLastRecipesQuery, [username]);
        return await this.addTags(result.rows);
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
            searchRecipesQuery += ` AND title LIKE '%${text}%'`;
        }
        if(time) {
            searchRecipesQuery += ` AND elkeszitesi_ido <= ${time}`;
        }
        searchRecipesQuery += ` ORDER BY rr.id ASC
            LIMIT 12 OFFSET $2 * 12;`;
        let result = await pool.query(searchRecipesQuery, [username, page]);
        return await this.addTags(result.rows);
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
        return result.rows[0].count;
    }
    async getSingleRecipe(recipeId) {
        let getSingleRecipeQuery = `select * from recipebook_recipes where id = $1;`;
        let result = await pool.query(getSingleRecipeQuery, [recipeId]);
        return result.rows[0];
    }
    async getSingleRecipeTags(recipeId) {
        let getSingleRecipeTagsQuery = `select tag_id, title from recipebook_recipe_tag_kapcsolat kapcs
        inner join recipebook_tags rt on rt.id = kapcs.tag_id
        where recipe_id = $1;`;
        let result = await pool.query(getSingleRecipeTagsQuery, [recipeId]);
        return result.rows;
    }
    async deleteSingleRecipe(recipeId) {
        let deleteSingleRecipeQuery = `delete from recipebook_recipes where id = $1;`;
        await pool.query(deleteSingleRecipeQuery, [recipeId]);
    }
    async saveRecipe(username, newRecipe) {
        let ingredients = newRecipe.ingredientsList.join(',');
        let saveRecipeQuery = `insert into recipebook_recipes(id, title, user_id, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, picture)
        values(nextval('s_recipebook_recipes'), $1, (select id from recipebook_user
        where username = $2), $3, current_timestamp, $4, $5, $6);`;
        let result = await pool.query(saveRecipeQuery, [newRecipe.recipeTitle, username, newRecipe.recipeTime, ingredients, newRecipe.elkeszites, newRecipe.picture]);
    }

}

module.exports = new RecipeRepository();