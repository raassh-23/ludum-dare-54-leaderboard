require('dotenv').config();

const { name, version } = require('../package.json');
const Hapi = require('@hapi/hapi');

const init = async () => {
    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

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

    await server.start();
    console.log(`Server running at ${server.info.uri}`);
};

init();
