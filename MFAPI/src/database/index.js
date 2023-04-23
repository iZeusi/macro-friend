const mongoose = require('mongoose');
const logger = require('../logger');

async function connect() {
    logger.info("DB Connecting...");
    try {
        const user = process.env.DB_USER;
        const password = process.env.DB_PASSWORD;
        const host = process.env.DB_HOST;
        const port = process.env.DB_PORT;
        const name = process.env.DB_NAME;
        const rs = process.env.DB_REPLICA_SET;

        const connectionString = `mongodb://${user}:${password}@${host}:${port}/${name}?replicaSet=${rs}`;

        logger.info(connectionString);

        await mongoose.connect(connectionString, {
            serverSelectionTimeoutMS: 5000
        });
        logger.info("Mongoose connected to Database!");
    } catch (e) {
        logger.error(e);
        logger.info("Mongoose failed to connect to Databaase!");
    }
}

module.exports = connect;
