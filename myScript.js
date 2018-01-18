/* eslint-disable */

function parseAsJson(response) {
  return response.json();
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

  if (abr === "EUR") {
    return "eur.png";
  }
  if (abr === "USD") {
    return "usd.png";
  }

  return "placeholder.png";
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

function addRatesToBody(list) {
  const ratesTable = document.querySelector(".rates table .table-row");

  list.forEach((item, index) => {
    const icon =
      '<td class="cell-item icon">' +
      '<img class="crypto-img" src="' +
      getIcon(item.data.base) +
      '" alt="">' +
      "</td>";

    const currencyName =
      '<td class="cell-item base-currency name-currency">' +
      getExtendedName(item.data.base) +
      "</td>";

    const balance =
      '<td class="cell-item balance">' +
      '<text class="base-currency">' +
      getExtendedName(item.data.base) +
      "</text>" +
      "<br>" +
      '<text class="native-currency">' +
      getSymbol(item.native_balance.currency) +
      " " +
      item.data.amount +
      "</text>" +
      "</td>";

    ratesTable.innerHTML =
      ratesTable.innerHTML +
      '<tr class="table-row">' +
      icon +
      currencyName +
      balance +
      "</tr>";
  });
}

function addAccountsToBody(list) {
  const walletsTable = document.querySelector(".wallets table");

  list.forEach((item, index) => {
    const icon =
      '<td class="cell-item icon">' +
      '<img class="crypto-img" src="images/' +
      getIcon(item.balance.currency) +
      ' " alt="">' +
      "</td>";

    const currencyName =
      '<td class="cell-item base-currency name-currency">' +
      getExtendedName(item.balance.currency) +
      "</td>";

    const balance =
      '<td class="cell-item balance">' +
      '<text class="base-currency">' +
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
