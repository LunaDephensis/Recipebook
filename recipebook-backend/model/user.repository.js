const pool = require('./pool');

class UserRepository {
    async getUser(username) {
        let result = await pool.query('select * from recipebook_user where username = $1;', [username]);
        return result.rows[0];
    }
    async existUser(username, email) {
        let result = await pool.query(`select count(*) from recipebook_user
        where username = $1 or email = $2;`, [username, email]);
        return result.rows[0].count > 0;
    }
    async signUpUser(username, password, email) {
        let user = await pool.query(`insert into recipebook_user(id, username, password, email)
        values(nextval('s_recipebook_user'), $1, $2, $3)`, [username, password, email]);
    }
}

module.exports = new UserRepository();