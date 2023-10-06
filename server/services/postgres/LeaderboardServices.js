const { Pool } = require('pg');
const InvalidError = require('../../exceptions/InvalidError');
const { mapLeaderboardDBToModel } = require('../../utils');

class LeaderboardServices {
  constructor() {
    this._pool = !process.env.HEROKU ?
      new Pool() :
      new Pool({
        connectionString: process.env.DATABASE_URL,
      });
  }

  async addItem({ username, score, timeMs, type }) {
    const query = {
      text: `INSERT INTO \
            leaderboard(username, score, time_ms, type) \
            VALUES($1, $2, $3, $4) RETURNING id`,
      values: [username, score, timeMs, type],
    };

    const { rows } = await this._pool.query(query);
    const resultId = rows[0].id;

    if (!resultId) {
      throw new InvalidError('Can\'t add item to leaderboard');
    }

    return resultId;
  }

  async getLeaderboard({ page, pageSize, type, search }) {
    const query = {};

    const offsetValue = (page - 1) * pageSize;

    const select = `SELECT * FROM (SELECT *, RANK() OVER (ORDER BY score DESC, time_ms ASC, created_at ASC) rank FROM leaderboard`;
    const whereSearch = `) as l WHERE username ILIKE $1`;
    const limit = `LIMIT $2 OFFSET $3`;

    const searchValue = `%${search}%`;

    if (type === 0) {
      query.text = `${select} ${whereSearch} ${limit}`;
      query.values = [searchValue, pageSize, offsetValue];
    } else {
      query.text = `${select} WHERE type = $4 ${whereSearch} ${limit}`;
      query.values = [searchValue, pageSize, offsetValue, type];
    }

    const { rows } = await this._pool.query(query);

    return rows.map(mapLeaderboardDBToModel);
  }

  async getCount(type, search) {
    const query = {};

    const select = `SELECT COUNT(id) FROM leaderboard`;
    const whereSearch = `WHERE username ILIKE $1`;

    const searchValue = `%${search}%`;

    if (type === 0) {
      query.text = `${select} ${whereSearch}`;
      query.values = [searchValue];
    } else {
      query.text = `${select} ${whereSearch} AND type = $2`;
      query.values = [searchValue, type];
    }

    const { rows } = await this._pool.query(query);

    return rows[0].count;
  }
}

module.exports = LeaderboardServices;
