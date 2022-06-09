const pool = require('./pool');

class TagRepository {
    async getRecipeTags(recipeId) {
        const getRecipeTagsQuery = `select rt.id, rt.title from recipebook_recipe_tag_kapcsolat kapcs 
        inner join recipebook_tags rt on kapcs.tag_id = rt.id
        where recipe_id = $1`;
        let result = await pool.query(getRecipeTagsQuery, [recipeId]);
        return result.rows;
    }
    async getUserTags(username) {
        const getUserTagsQuery = `select rt.id, title from recipebook_tags rt 
        inner join recipebook_user ru on ru.id = rt.user_id
        where username = $1;`;
        let result = await pool.query(getUserTagsQuery, [username]);
        return result.rows;
    }
}

module.exports = new TagRepository();