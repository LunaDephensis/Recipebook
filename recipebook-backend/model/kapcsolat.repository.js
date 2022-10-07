const pgp = require('pg-promise');
const pool = require('./pool');

class KapcsolatRepository {
    async saveAllNewKapcsolat(recipeId, tagIds) {
        let saveNewKapcsolatQuery = new pgp.QueryFile('../model/queries/insertKapcsolat.sql');
        tagIds.forEach( async (tagId) => {
            await pool.query(saveNewKapcsolatQuery, [recipeId, tagId]);
        });
    }
    
    async deleteOldTags(recipeId, tagIds) {
        let deleteOldTagQuery = `delete from recipebook_recipe_tag_kapcsolat where recipe_id = $1 and tag_id = $2;`;
        tagIds.forEach( async (tagId) => {
            await pool.query(deleteOldTagQuery, [recipeId, tagId]);
        });
    }
}



module.exports = new KapcsolatRepository();