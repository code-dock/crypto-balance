const mergeContacts = require("root-require")("./server/actions/mergeContacts");
const purifier = require("root-require")("./server/lib/routePurifier");
const errors = require("root-require")("./server/lib/errors");
const Future = require("fluture");

module.exports = req => {
    if (req.method !== "POST") {
        return Future.of(
            purifier.respond.custom(errors.badRequest("This endpoint only accepts POST"))
        );
    }

    const { body } = req;

    return mergeContacts(body)
        .map(() => purifier.respond.json({ content: { success: true } }))
        .chainRej(err => Future.of(purifier.respond.custom(errors.badRequest(err))));
};
