const InvalidError = require('../exceptions/InvalidError');

/* eslint-disable camelcase */
const mapLeaderboardDBToModel = ({
  id,
  username,
  score,
  time_ms,
  created_at,
  type,
}) => ({
  id,
  username,
  score,
  type: toTypeString(type),
  timeMs: time_ms,
  createdAt: created_at,
});

const toTypeInteger = (type) => type === 'desktop' ? 1 : 2;
const toTypeString = (type) => type === 1 ? 'desktop' : 'mobile';

module.exports = {
  mapLeaderboardDBToModel,
  toTypeInteger,
};
