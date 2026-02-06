const {ApolloServer} = require('@apollo/server');
const {expressMiddleware} = require('@apollo/server/express4');
const {ApolloServerPluginDrainHttpServer} = require('@apollo/server/plugin/drainHttpServer');
const {makeExecutableSchema} = require('@graphql-tools/schema');
const {WebSocketServer} = require('ws');
const {useServer} = require('graphql-ws/lib/use/ws');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

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
    // Create schema
    const schema = makeExecutableSchema({typeDefs, resolvers});

    // Create WebSocket server for subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    // Set up WebSocket server
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

    // Create Apollo Server
    const server = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({httpServer}),
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
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return {
                message: error.message,
                locations: error.locations,
                path: error.path,
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