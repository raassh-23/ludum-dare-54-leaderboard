const LeaderboardHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'leaderboard',
  version: '1.0.0',
  register: async (server, {service, validator}) => {
    const leaderboardHandler = new LeaderboardHandler(service, validator);
    server.route(routes(leaderboardHandler));
  },
};
