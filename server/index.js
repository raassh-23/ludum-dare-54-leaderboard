require('dotenv').config();

const path = require('path');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');

const leaderboard = require('./api/leaderboard');
const LeaderboardServices = require('./services/postgres/LeaderboardServices');
const LeaderboardValidator = require('./validator/leaderboard');

const ClientError = require('./exceptions/ClientError');

const init = async () => {
    const leaderboardService = new LeaderboardServices();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register(Inert);

    await server.register([
        {
            plugin: leaderboard,
            options: {
                service: leaderboardService,
                validator: LeaderboardValidator,
            },
        },
    ]);

    server.route({
        method: 'GET',
        path: '/{path*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../client/build/'),
                listing: false,
                index: true,
            },
        },
    });

    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        if (response instanceof ClientError) {
            return h.response({
                error: true,
                message: response.message,
            }).code(response.statusCode);
        } else if (response instanceof Error) {
            console.error(request.info.referrer, response);

            const {message, statusCode} = response.output.payload;

            return h.response({
                error: true,
                message,
            }).code(statusCode);
        }

        return response.continue || response;
    });

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();
