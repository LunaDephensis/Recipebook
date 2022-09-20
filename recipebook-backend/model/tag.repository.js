const pool = require('./pool');

class TagRepository {
    async getRecipeTags(recipeId) {
        const getRecipeTagsQuery = `select rt.id, rt.title from recipebook_recipe_tag_kapcsolat kapcs 
        inner join recipebook_tags rt on kapcs.tag_id = rt.id
        where recipe_id = $1`;
        let result = await pool.query(getRecipeTagsQuery, [recipeId]);
        return result;
    }
    async getUserTags(username) {
        const getUserTagsQuery = `select rt.id, title from recipebook_tags rt 
        inner join recipebook_user ru on ru.id = rt.user_id
        where username = $1;`;
        let result = await pool.query(getUserTagsQuery, [username]);
        return result;
    }
    async createNewTag(username, title) {
        const createNewTagQuery = `insert into recipebook_tags(id, title, user_id)
        values(nextval('s_recipebook_tags'), $1, (select id from recipebook_user
        where username = $2));`;
        let result = await pool.query(createNewTagQuery, [title, username]);
    }
}

module.exports = new TagRepository();