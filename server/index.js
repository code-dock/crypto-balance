/* eslint-disable no-console, prefer-template */
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
const Future = require("fluture");
const { traverse } = require("ramda");
const request = require("request");

const PORT = 8080;
const DOMAIN = `http://localhost:${PORT}`;
const app = express();

const postRequest = (url, options) =>
    Future((reject, resolve) => {
        request.post(
            url,
            options,
            (err, res) => (err ? reject(err) : resolve(res))
        );
    });

// const client = new Client({
//     apiKey: credentials.apiKey,
//     apiSecret: credentials.apiSecret
// });
//
// const currencies = ["BTC", "BCH", "LTC", "ETH"];
//
// const getRate = (coinbaseClient, baseCurrency, rateCurrency) =>
//     Future((reject, resolve) => {
//         coinbaseClient.getBuyPrice(
//             { currencyPair: `${rateCurrency}-${baseCurrency}` },
//             (err, obj) => (err ? reject(err) : resolve(obj))
//         );
//     });
//
//
// app.get("/", (req, res) => {
//     res.json({
//         working: "YES!"
//     });
// });
//
// app.get("/accounts", (req, res) => {
//     client.getAccounts({}, (err, accounts) => {
//         if (err) {
//             res.json({
//                 error: err
//             });
//         } else {
//             res.json(accounts);
//         }
//     });
// });
//
// app.get("/rates", (req, res) => {
//     traverse(Future.of, c => getRate(client, "GBP", c), currencies).fork(
//         err =>
//             res.json({
//                 error: err
//             }),
//         rates => res.json(rates)
//     );
// });

// ============================================================================
// OAuth
// ============================================================================
const redirectUri = DOMAIN + "/oauth/callback";
const database = {};

const isLoggedIn = (req, res, next) => {
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

app.get("/test", isLoggedIn, (req, res) => res.send("Works!"));

app.get(
    "/oauth/callback",
    purifier.route(req => {
        const code = req.query.code;
        const userID = req.ip;

        console.log("Code", code);
        console.log("UserID", userID);

        return postRequest("https://api.coinbase.com/oauth/token", {
            json: {
                grant_type: "authorization_code",
                code,
                client_id: credentials.clientID,
                client_secret: credentials.clientSecret,
                redirect_uri: redirectUri
            }
        })
            .map(res => {
                database[userID] = {
                    accessToken: res.body.access_token,
                    refresh_token: res.body.refresh_token
                };
                console.log(database[userID]);
            })
            .map(_ => purifier.respond.redirect({ path: "/success.html" }));
    })
);

app.listen(PORT, () => console.log("Server listening on port", PORT));
