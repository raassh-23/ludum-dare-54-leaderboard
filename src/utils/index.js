const InvalidError = require('../exceptions/InvalidError');

/* eslint-disable camelcase */
const mapLeaderboardDBToModel = ({
  id,
  username,
  score,
  time_ms,
  created_at,
}) => ({
  id,
  username,
  score,
  timeMs: time_ms,
  createdAt: created_at,
});

module.exports = {
  mapLeaderboardDBToModel,
};
