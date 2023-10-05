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

  async getLeaderboard({ page, pageSize, type }) {
    const query = {};

    const select = `SELECT * FROM leaderboard`;
    const order = `ORDER BY score DESC, time_ms ASC, created_at ASC`;
    const limit = `LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;

    if (type === 0) {
      query.text = `${select} ${order} ${limit}`;
    } else {
      query.text = `${select} WHERE type = $1 ${order} ${limit}`;
      query.values = [type];
    }

    const { rows } = await this._pool.query(query);

    return rows.map(mapLeaderboardDBToModel);
  }

  async getCount(type) {
    const query = {};

    const select = `SELECT COUNT(id) FROM leaderboard`;

    if (type === 0) {
      query.text = `${select}`;
    } else {
      query.text = `${select} WHERE type = $1`;
      query.values = [type];
    }

    const { rows } = await this._pool.query(query);

    return rows[0].count;
  }
}

module.exports = LeaderboardServices;
