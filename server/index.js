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

const express = require("express");
const Future = require("fluture");
const { traverse } = require("ramda");
const request = require("request");

const PORT = 8080;
const DOMAIN = `http://localhost:${PORT}`;
const app = express();

const postRequest = (url, options) =>
    Future((reject, resolve) =>
        request.post(
            url,
            options,
            (err, res) => (err ? reject(err) : resolve(res))
        )
    );

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

app.use(express.static("./server/static"));

app.get(
    "/oauth/callback",
    purifier.route(req => {
        const code = req.query.code;
        console.log("Code", code);

        return postRequest("https://api.coinbase.com/oauth/token", {
            json: {
                grant_type: "authorization_code",
                code,
                client_id: credentials.clientID,
                client_secret: credentials.clientSecret,
                redirect_uri: redirectUri
            }
        })
            .map(res => console.log(res.body))
            .map(_ => purifier.redirect({ path: "/success" }));
    })
);

app.listen(PORT, () => console.log("Server listening on port", PORT));
