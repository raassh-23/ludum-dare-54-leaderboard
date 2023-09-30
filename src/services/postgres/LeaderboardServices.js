const {Pool} = require('pg');
const InvalidError = require('../../exceptions/InvalidError');
const {mapLeaderboardDBToModel} = require('../../utils');

class LeaderboardServices {
  constructor() {
    this._pool = !process.env.HEROKU ?
      new Pool() :
      new Pool({
        connectionString: process.env.DATABASE_URL,
      });
  }

  async addItem({username, score, timeMs}) {
    const query = {
      text: `INSERT INTO \
            leaderboard(username, score, time_ms) \
            VALUES($1, $2, $3) RETURNING id`,
      values: [username, score, timeMs],
    };

    const {rows} = await this._pool.query(query);
    const resultId = rows[0].id;

    if (!resultId) {
      throw new InvalidError('Can\'t add item to leaderboard');
    }

    return resultId;
  }

  async getLeaderboard(page, pageSize) {
    const query = {
      text: `SELECT * FROM leaderboard \
            ORDER BY score DESC, created_at ASC \
            LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
    };

    const {rows} = await this._pool.query(query);

    return rows.map(mapLeaderboardDBToModel);
  }

  async getCount() {
    const query = {
      text: `SELECT COUNT(id) FROM leaderboard`,
    };
  
    const {rows} = await this._pool.query(query);
  
    return rows[0].count;
  }
}

module.exports = LeaderboardServices;
