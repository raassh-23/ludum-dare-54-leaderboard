require('dotenv').config();

const { name, version } = require('../package.json');
const path = require('path');

const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

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

    await server.register([
        Inert,
        Vision,
    ]);

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return {
                error: false,
                message: 'API is running',
                data: {
                    name,
                    version,
                },
            };
        },
    });

    server.route({
        method: 'GET',
        path: '/app/{path*}',
        handler: {
            directory: {
                path: path.join(__dirname, '../client/build/'),
                listing: false,
                index: true,
            },
        },
    });

    await server.register([
        {
            plugin: leaderboard,
            options: {
                service: leaderboardService,
                validator: LeaderboardValidator,
            },
        },
    ]);

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
