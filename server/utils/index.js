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

const toTypeInteger = (type) => {
  switch (type) {
    case "desktop":
      return 1;
    case "mobile":
      return 2;
    default:
      return 0;
  }
};
const toTypeString = (type) => {
  switch (type) {
    case 1:
      return "desktop";
    case 2:
      return "mobile";
    default:
      return "all";
  }
};

module.exports = {
  mapLeaderboardDBToModel,
  toTypeInteger,
};
