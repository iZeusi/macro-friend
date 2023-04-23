const express = require('express');
const cors = require('cors');
const initDB = require("./database");
const logger = require("./logger");
const routes = require('./routes');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
    credentials: true,
}));
app.use('/api', routes);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(err.statusCode || 500)
        .send({ error: err.message });
});
async function startServer() {
    await initDB();

    app.listen(port, () => {
        logger.info(`Server listening to http://localhost:${port}`)
    })
}


module.exports = startServer;