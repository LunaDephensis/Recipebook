const pool = require('./pool');

class KapcsolatRepository {
    async saveAllNewKapcsolat(recipeId, tagIds) {
        let saveNewKapcsolatQuery = `insert into recipebook_recipe_tag_kapcsolat(id, recipe_id, tag_id)
        values(nextval('s_recipebook_recipe_tag_kapcsolat'), $1, $2);`;
        tagIds.forEach( async (tagId) => {
            await pool.query(saveNewKapcsolatQuery, [recipeId, tagId]);
        });
    }
    async deleteSingleRecipeKapcsolat(recipeId) {
        let deleteSingleRecipeKapcsolatQuery = `delete from recipebook_recipe_tag_kapcsolat where recipe_id = $1;`;
        await pool.query(deleteSingleRecipeKapcsolatQuery, [recipeId]);
    }
    async deleteOldTags(recipeId, tagIds) {
        let deleteOldTagQuery = `delete from recipebook_recipe_tag_kapcsolat where recipe_id = $1 and tag_id = $2;`;
        tagIds.forEach( async (tagId) => {
            await pool.query(deleteOldTagQuery, [recipeId, tagId]);
        });
    }
}



module.exports = new KapcsolatRepository();