const InvalidError = require('../../exceptions/InvalidError');
const { toTypeInteger } = require('../../utils');

class LeaderboardHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postLeaderboardHandler = this.postLeaderboardHandler.bind(this);
    this.getLeaderboardHandler = this.getLeaderboardHandler.bind(this);
  }

  async postLeaderboardHandler({ payload }, h) {
    const newItem = this._validator.validatePayload(payload);

    const itemId = await this._service.addItem({
      ...newItem,
      type: toTypeInteger(newItem.type),
    });

    return h.response({
      error: false,
      message: 'Item added to leaderboard',
      data: {
        id: itemId,
      },
    }).code(201);
  }

  async getLeaderboardHandler({ query }) {
    const {
      page,
      pageSize,
      type: typeQuery,
      search,
    } = this._validator.validateQuery(query);

    const type = toTypeInteger(typeQuery);

    const totalCount = await this._service.getCount(type, search);
    const maxPage = Math.ceil(totalCount / pageSize) || 1;

    if (page > maxPage) {
      throw new InvalidError('Page exceeds max page');
    }

    const items = await this._service.getLeaderboard({
      page,
      pageSize,
      type,
      search,
    });

    return {
      error: false,
      message: 'Leaderboard retrieved',
      data: {
        page,
        maxPage,
        count: items.length,
        items,
      },
    };
  }
}

module.exports = LeaderboardHandler;
