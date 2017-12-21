/* eslint-disable no-console, prefer-template */
/*
    Run it with `node server.js`

    You can then access it at:
        localhost:8080/accounts
        localhost:8080/rates
 */

const Client = require("coinbase").Client;
const credentials = require("./credentials.json");
const express = require("express");
const Future = require("fluture");
const { traverse } = require("ramda");

const client = new Client({
    apiKey: credentials.apiKey,
    apiSecret: credentials.apiSecret
});

const currencies = ["BTC", "BCH", "LTC", "ETH"];

const getRate = (coinbaseClient, baseCurrency, rateCurrency) =>
    Future((reject, resolve) => {
        coinbaseClient.getBuyPrice(
            { currencyPair: `${rateCurrency}-${baseCurrency}` },
            (err, obj) => (err ? reject(err) : resolve(obj))
        );
    });

const PORT = 8080;
const app = express();

app.get("/", (req, res) => {
    res.json({
        working: "YES!"
    });
});

app.get("/accounts", (req, res) => {
    client.getAccounts({}, (err, accounts) => {
        if (err) {
            res.json({
                error: err
            });
        } else {
            res.json(accounts);
        }
    });
});

app.get("/rates", (req, res) => {
    traverse(Future.of, c => getRate(client, "GBP", c), currencies).fork(
        err =>
            res.json({
                error: err
            }),
        rates => res.json(rates)
    );
});

app.listen(PORT, () => console.log("Server listening on port", PORT));
