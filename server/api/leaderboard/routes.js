const routes = (handler) => [
  {
    method: 'GET',
    path: '/leaderboard',
    handler: handler.getLeaderboardHandler,
  },
  {
    method: 'POST',
    path: '/leaderboard',
    handler: handler.postLeaderboardHandler,
  },
];

module.exports = routes;
