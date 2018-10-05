/* eslint-disable */

// Display helpScreen
var helpButton = document.getElementById('helpButton');
helpButton.addEventListener("click", function() {
  let helpScreen = document.getElementById("helpScreen");
  if (helpScreen.style.top === "0%") {
    helpScreen.style.top = "100%";
  } else {
    helpScreen.style.top = "0%";
  }
});



// Get currencySymbol from radio buttons
let currencySymbolToggle = document.querySelector(".table__currency-toggle input:checked~.table__currency-toggle--symbol");
let currencySymbol = currencySymbolToggle.innerHTML;
// accounts table currency amount
let accountsCurrencyAmounts = document.getElementsByClassName("table-accounts__currency-amount");
// rates table currency amount
let a;
for (a = 0; a < accountsCurrencyAmounts.length; a++) {
  // Add symbol to amount
  accountsCurrencyAmounts[a].innerHTML = currencySymbol.concat(accountsCurrencyAmounts[a].innerHTML);
}
let ratesCurrencyAmounts = document.getElementsByClassName("table-rates__amount");
for (a = 0; a < ratesCurrencyAmounts.length; a++) {
  ratesCurrencyAmounts[a].innerHTML = currencySymbol.concat(ratesCurrencyAmounts[a].innerHTML);
}

document.addEventListener("change", function() {
  // Set currencySymbol from radio buttons
  currencySymbolToggle = document.querySelector(".table__currency-toggle input:checked~.table__currency-toggle--symbol");
  currencySymbol = currencySymbolToggle.innerHTML;

  for (a = 0; a < accountsCurrencyAmounts.length; a++) {
    // Remove any existing symbol from amount
    accountsCurrencyAmounts[a].innerHTML = accountsCurrencyAmounts[a].innerHTML.slice(1);
    // Add symbol to amounts
    accountsCurrencyAmounts[a].innerHTML = currencySymbol.concat(accountsCurrencyAmounts[a].innerHTML);
  }

  for (a = 0; a < ratesCurrencyAmounts.length; a++) {
    ratesCurrencyAmounts[a].innerHTML = ratesCurrencyAmounts[a].innerHTML.slice(1);
    ratesCurrencyAmounts[a].innerHTML = currencySymbol.concat(ratesCurrencyAmounts[a].innerHTML);
  }
});

// calculate cryptos

// on watching input for changes
document.addEventListener("input", function(e) {
  let target = e.target;
  if (target.classList.contains("table-rates__amount--input")) {
    if (isNaN(parseInt(target.value))) {
      console.log();

    }
    console.log(parseInt(target.value) * 10);
  }
}); // END watching input

let logInContent;

function showLogInScreen() {
  logInContent = document.createElement("div");
  logInContent.classList.add("login-content");
  document.body.appendChild(logInContent);

  let content = document.createElement("div");
  content.classList.add("content-container");
  logInContent.appendChild(content);

  let icon = document.createElement("img");
  icon.classList.add("login-icon");
  icon.setAttribute("src", "/images/icon.png");
  content.appendChild(icon);

  let button = document.createElement("a");
  button.classList.add("login-button");
  button.setAttribute(
    "href",
    "https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID +
    "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
    "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
  );
  button.setAttribute("target", "_blank");

  button.innerHTML = "Sign in with Coinbase";
  content.appendChild(button);

  const madeBy = document.createElement("div");
  madeBy.classList.add("madeby");
  madeBy.innerHTML =
    '<p>Made by <a href="http://murphyme.co.uk/" target="_blank">Jack Murphy</a></p>';
  logInContent.appendChild(madeBy);
}

// START rates page
const accountsTable = document.createElement('table');
const ratesTable = document.createElement("table");

function createHeader() {
  const header = document.createElement("header");
  header.classList.add("header");
  document.body.appendChild(header);

  const title = document.createElement("h1");
  title.classList.add("title");
  title.innerHTML = "Title";
  header.appendChild(title);

  const image = document.createElement("img");
  image.classList.add("img");
  image.classList.add("login-icon");
  image.setAttribute("src", "images/icon.png");
  header.appendChild(image);
}

// Create rows for specific currencies, called inside getCurrencyAbreviation
function createRatesRow(abr, val) {
  let tableRow = document.createElement('tr');

  const cryptoName = document.createElement('td');
  cryptoName.innerHTML = abr;
  tableRow.appendChild(cryptoName);
  ratesTable.appendChild(tableRow);

  const cryptoValue = document.createElement('td');
  cryptoValue.innerHTML = val;
  tableRow.appendChild(cryptoValue);
  ratesTable.appendChild(tableRow);

  let equalTo = document.createElement('td');
  equalTo.innerHTML = " = ";
  tableRow.appendChild(equalTo);
  ratesTable.appendChild(tableRow);

  const moneyValue = document.createElement('td');
  moneyValue.innerHTML = `<span>${getSymbol(abr)}</span> ${val}`;
  tableRow.appendChild(moneyValue);
  ratesTable.appendChild(tableRow);

  const priceChangeCell = document.createElement('td');
  priceChangeCell.innerHTML = "hi";
  tableRow.appendChild(priceChangeCell);
  ratesTable.appendChild(tableRow);
}

function addRatesToBody() {
  fetch('https://api.coinbase.com/v2/exchange-rates?currency=GBP')
    .then(response => response.json())
    .then(function(response) {
      createHeader();
      let rates = response.data.rates;
      for (let key in rates) {
        let value = rates[key];
        // Look for specific currencies
        getCurrencyAbreviation(key, value);
      }
      document.body.appendChild(ratesTable);
    });
}


function createAccountsRow(data) {
  const accountsRow = document.createElement('tr');

  const crypto = document.createElement('td');
  const image = document.createElement('img');
  image.classList.add('accounts__placeholder');
  image.setAttribute('src', `/images/icon.png`)

  crypto.appendChild(image);
  accountsRow.appendChild(crypto);

  let accountName = document.createElement('td');
  accountName.innerHTML = "your " + data.balance.currency;
  accountsTable.appendChild(accountName);

  let equalTo = document.createElement('td');
  equalTo.innerHTML = " is currently worth ";
  accountsRow.appendChild(equalTo);
  ratesTable.appendChild(accountsRow);

  let cryptoValue = document.createElement('td');
  cryptoValue.innerHTML = data.balance.amount;

  accountsRow.appendChild(cryptoValue);
}

function getSymbol(abr) {
  switch (abr) {
    case "GBP":
      return "£";
      break;
    case "USD":
      return "$";
      break;
    case "EUR":
      return "€";
      break;
    default:
      return abr;
      break;
  }
}

// function getIcon(abr) {
//   switch (abr) {
//     case "BCH":
//       return "bch.png";
//     case "LTC":
//       return "ltc.png";
//       break;
//     case "ETH":
//       return "eth.jpg";
//       break;
//     case "BTC":
//       return "btc.png";
//       break;
//     case "EUR":
//       return "eur.png";
//       break;
//     case "USD":
//       return "usd.png";
//       break;
//     default:
//       return "placeholder.png";
//       break;
//   }
// }

function getCurrencyAbreviation(abr, val) {
  switch (abr) {
    case "BTC":
      createRatesRow(abr, val);
      break;

    case "ETH":
      createRatesRow(abr, val);
      break;

    case "USD":
      createRatesRow(abr, val);
      break;

    case "BCH":
      createRatesRow(abr, val);
      break;

    case "LTC":
      createRatesRow(abr, val);
      break;
  }
}

function getCurrencyValue(abr, val) {
  switch (abr) {
    case "BTC":
      return val;
      break;

    case "ETH":
      return val;
      break;

    case "USD":
      return val;
      break;

    case "BCH":
      return val;
      break;

    case "LTC":
      return val;
      break;
    default:
      return " ";
  }
}


let CLIENT_ID = "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29";
let CLIENT_SECRET = "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8";
let REDIRECT_URI = "http://murphyme.co.uk/success.html";
let ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
let REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";
let authorization_code = "authorization_code";
let access_token = "access_token";
let refresh_token = "refresh_token";
let temporaryCode = null;
let refreshTokenValue = null;
let accessTokenValue = null;

// Show Login Screen
// document.addEventListener("DOMContentLoaded", showLogInScreen);

// Check urls
// chrome.tabs.query({}, function(tabs) {
//   let i;
//   for (i = 0; i < tabs.length; i++) {
//
//     if (tabs[i].url.includes(REDIRECT_URI)) {
//       // Split url
//       let splitUrl = tabs[i].url.split("?");
//       let params = splitUrl[1];
//       // Split params
//       let splitParams = params.split("=");
//       let value = params.split("=")[1];
//       // Store authorization_code
//       localStorage.setItem(authorization_code, value);
//       temporaryCode = localStorage.getItem(authorization_code);
//
//       testerPoop();
//     }
//   }
// });


function testerPoop() {
  // Make post request to Coinbase server with grant_type= authorization_code
  fetch('https://api.coinbase.com/oauth/token' +
      "?grant_type=" + authorization_code +
      "&code=" + temporaryCode +
      "&client_id=" + CLIENT_ID +
      "&client_secret=" + CLIENT_SECRET +
      "&redirect_uri=" + REDIRECT_URI, {
        method: 'post',
        headers: {
          "CB-Version": "2018-09-26"
        }
      })
    .then(response => response.json())
    .then(obj => {
      // check if object contains token_type
      if (obj.token_type) {
        // Store ACCESS_TOKEN and REFRESH_TOKEN
        localStorage.setItem(REFRESH_TOKEN_KEY, obj.refresh_token);
        localStorage.setItem(ACCESS_TOKEN_KEY, obj.access_token);
        refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
        accessTokenValue = localStorage.getItem(ACCESS_TOKEN_KEY);
        console.log("Your tokens are stored");
        logInContent.style.display = "none";
      } else {
        logInContent.style.display = "block";
        console.log("You probably need to login again");
      } // END else

    })
    .then(function() {
      addRatesToBody();
      addAccountsToBody();
    });
} // END testerPoop

function addAccountsToBody() {
  fetch('https://api.coinbase.com/v2/accounts', {
      headers: {
        "Authorization": "Bearer " + accessTokenValue,
      },
    })
    .then(response => response.json())
    .then(function(response) {
      let accounts = response.data;
      console.log(accounts);
      for (key in accounts) {
        let info = accounts[key];
        createAccountsRow(info);
        console.log(info.balance.currency);
        console.log(info.balance.amount);
      }
    });
}
