/* eslint-disable */

function parseAsJson(response) {
    return response.json();
}

function addRatesToBody(list) {
    list.forEach(item => {
        const ratesTable = document.querySelector(".rates table .table-row");

        // Here we are saying that the table's HTML content is
        // whatever is already there, plus this big string.
        // This means that we are adding content to the end of the table
        ratesTable.innerHTML =
            ratesTable.innerHTML +
            // A backtick like this one here ` means that we are starting a
            // string that will span through multiple lines.
            // Inside this strings, we can make reference to variables by
            // writing them like this ${variableName}
            `
                <td class="cell-item">${item.data.base}•</td>
                <td class="cell-item">£${item.data.amount}</td>
            `;
    });
}

function getSymbol(abr) {
    if (abr === "GBP") {
        return "£";
    }

    if (abr === "USD") {
        return "$";
    }

    if (abr === "EUR") {
        return "€";
    }
    return abr;
}

function getIcon(abr) {
    if (abr === "BCH") {
        return "bch.png";
    }

    if (abr === "LTC") {
        return "ltc.png";
    }

    if (abr === "ETH") {
        return "eth.jpg";
    }

    if (abr === "BTC") {
        return "btc.png";
    }

    return "placeholder.jpg";
}

function getExtendedName(abr) {
    if (abr === "BCH") {
        return "Bitcoin Cash";
    }

    if (abr === "LTC") {
        return "Litecoin";
    }

    if (abr === "ETH") {
        return "Etherium";
    }

    if (abr === "BTC") {
        return "Bitcoin";
    }

    if (abr === "GBP") {
        return "British Pound";
    }

    if (abr === "EUR") {
        return "Euro";
    }

    if (abr === "USD") {
        return "US Dollar";
    }

    return abr;
}

function addAccountsToBody(list) {
    const walletsTable = document.querySelector(".wallets table");

    list.forEach((item, index) => {
        const icon =
            '<td class="cell-item icon">' +
            '<img class="crypto-img" src="' +
            getIcon(item.balance.currency) +
            '" alt="">' +
            "</td>";

        const currencyName =
            '<td class="cell-item base-currency name-currency">' +
            getExtendedName(item.balance.currency) +
            "</td>";

        const balance =
            '<td class="cell-item balance">' +
            '<text class="base-currency">' +
            item.balance.amount +
            " " +
            getExtendedName(item.balance.currency) +
            "</text>" +
            "<br>" +
            '<text class="native-currency">' +
            getSymbol(item.native_balance.currency) +
            " " +
            item.native_balance.amount +
            "</text>" +
            "</td>";

        walletsTable.innerHTML =
            walletsTable.innerHTML +
            '<tr class="table-row">' +
            icon +
            currencyName +
            balance +
            "</tr>";
    });
}

fetch("http://localhost:8080/rates")
    .then(parseAsJson)
    .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
    .then(parseAsJson)
    .then(addAccountsToBody);
