const pool = require('./pool');
const tagRepo = require('./tag.repository');

class RecipeRepository {
    async getRecipes(username, page) {
        const getRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, kep FROM recipebook_recipes rr
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
        return result.rows[0].count;
    }
    async getLastRecipes(username) {
        const getLastRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, kep FROM recipebook_recipes rr
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
        let searchRecipesQuery = `SELECT rr.id, title, elkeszitesi_ido, letrehozas_datuma, hozzavalok, elkeszitesi_mod, kep FROM recipebook_recipes rr
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
}

module.exports = new RecipeRepository();