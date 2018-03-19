/* eslint-disable no-console */
/*
    Run it with `node server.js`

    You can then access it at:
        localhost:8080/accounts
        localhost:8080/rates
 */

const Client = require("coinbase").Client;
const credentials = require("root-require")("./server/.credentials.json");
const purifier = require("root-require")("./server/lib/routePurifier");
const errors = require("root-require")("./server/lib/errors");
const express = require("express");
const routes = require("require-dir-all")("./routes", {
    recursive: true
});

console.log(Object.keys(routes));

const PORT = 8080;
const app = express();

// For now we are using an in-memory database to simplify things
const database = {};

// Function to make sure user is logged before calling a route
const isLoggedIn = (req, res, next) => {
    // We are temporarily using the request's IP to make things easier
    const userID = req.ip;
    // const userID = req.get("X-USER-ID");
    const userInfo = database[userID];

    if (!userInfo) {
        const err = errors.unauthorised("User not logged in.");
        const pureResponse = purifier.respond.custom(err);
        return purifier.route(pureResponse)(req, res, next);
    }

    const { accessToken, refreshToken } = userInfo;
    req.coinbaseClient = new Client({ accessToken, refreshToken });
    return next();
};

app.use(express.static(`${__dirname}/static`));

// OAuth route
app.get(
    "/oauth",
    purifier.route(routes.oauth(credentials, database, "/success.html"))
);

// Coibase requests
app.get("/accounts", isLoggedIn, purifier.route(routes.accounts));
app.get("/rates", isLoggedIn, purifier.route(routes.rates));

app.listen(PORT, () => console.log("Server listening on port", PORT));
