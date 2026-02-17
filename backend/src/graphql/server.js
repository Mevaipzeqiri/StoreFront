const {ApolloServer} = require('@apollo/server');
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer');
const {ApolloServerPluginLandingPageLocalDefault} = require('@apollo/server/plugin/landingPage/default');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const {WebSocketServer} = require('ws');
const {useServer} = require('graphql-ws/lib/use/ws');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const {GraphQLCustomError} = require('./errors');

const getUser = async (token) => {
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const result = await db.query(
            `SELECT u.id, u.username, u.email, r.name as role, u.is_active
             FROM users u
                      LEFT JOIN roles r ON u.role_id = r.id
             WHERE u.id = $1`,
            [decoded.userId]
        );

        if (result.rows.length === 0 || !result.rows[0].is_active) {
            return null;
        }

        return result.rows[0];
    } catch (error) {
        return null;
    }
};

const createApolloServer = async (httpServer) => {
    const schema = makeExecutableSchema({typeDefs, resolvers});

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    const serverCleanup = useServer(
        {
            schema,
            context: async (ctx) => {
                const token = ctx.connectionParams?.authorization?.replace('Bearer ', '') || '';
                const user = await getUser(token);
                return {user};
            },
        },
        wsServer
    );

    const server = new ApolloServer({
        schema,
        introspection: true, // Enable introspection in all environments
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
            ApolloServerPluginLandingPageLocalDefault({embed: true}),
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            await serverCleanup.dispose();
                        },
                    };
                },
            },
        ],
        formatError: (formattedError, error) => {
            console.error('GraphQL Error:', {
                message: formattedError.message,
                code: formattedError.extensions?.code,
                path: formattedError.path,
                locations: formattedError.locations
            });

            if (error.originalError instanceof GraphQLCustomError) {
                return {
                    message: formattedError.message,
                    extensions: {
                        code: formattedError.extensions.code,
                        statusCode: formattedError.extensions.statusCode,
                        ...formattedError.extensions,
                        ...(process.env.NODE_ENV === 'development' && {
                            stacktrace: formattedError.extensions.stacktrace
                        })
                    },
                    locations: formattedError.locations,
                    path: formattedError.path
                };
            }

            return {
                message: process.env.NODE_ENV === 'development'
                    ? formattedError.message
                    : 'An unexpected error occurred',
                extensions: {
                    code: 'INTERNAL_SERVER_ERROR',
                    statusCode: 500,
                    ...(process.env.NODE_ENV === 'development' && {
                        originalError: formattedError.message,
                        stacktrace: formattedError.extensions?.stacktrace
                    })
                },
                locations: formattedError.locations,
                path: formattedError.path
            };
        },
    });

    await server.start();

    return server;
};

const context = async ({req}) => {
    const token = req.headers.authorization?.replace('Bearer ', '') || '';
    const user = await getUser(token);
    return {user};
};

module.exports = {createApolloServer, context};