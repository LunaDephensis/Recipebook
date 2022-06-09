const pool = require('./pool');

class UserRepository {
    async getUser(username) {
        let result = await pool.query('select * from recipebook_user where username = $1;', [username]);
        return result.rows[0];
    }
}

module.exports = new UserRepository();