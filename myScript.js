/* eslint-disable */


function showLogInScreen() {
  const logInContent = document.createElement("div");
  logInContent.classList.add("login-content");
  document.body.appendChild(logInContent);

  const content = document.createElement("div");
  content.classList.add("content-container");
  logInContent.appendChild(content);

  const icon = document.createElement("img");
  icon.classList.add("login-icon");
  icon.setAttribute("src", "/images/icon.png");
  content.appendChild(icon);

  const button = document.createElement("a");
  button.classList.add("login-button");
  button.setAttribute(
    "href",
    "https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID + "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) + "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
    );
  button.setAttribute("target", "_blank");

  button.innerHTML = "Sign in with Coinbase";
  content.appendChild(button);

  const madeBy = document.createElement("div");
  madeBy.classList.add("madeby");
  madeBy.innerHTML =
    '<p>Made by <a href="http://murphyme.co.uk/" target="_blank">Jack Murphy</a></p>';
  logInContent.appendChild(madeBy);

  //
  // button.addEventListener("click", function() {
  //   logInContent.classList.add("hidden");
  // });

}


// START rates page

function createHeader() {
  const header = document.createElement("header");
  header.classList.add("header");
  document.body.appendChild(header);

  const title = document.createElement("h1");
  title.classList.add("title");
  title.innerHTML = "Goldfish";
  header.appendChild(title);

  const image = document.createElement("img");
  image.classList.add("img");
  image.setAttribute("src", "images/icon.png");
  header.appendChild(image);
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

function getIcon(abr) {
  switch (abr) {
    case "BCH":
      return "bch.png";
    case "LTC":
      return "ltc.png";
      break;
    case "ETH":
      return "eth.jpg";
      break;
    case "BTC":
      return "btc.png";
      break;
    case "EUR":
      return "eur.png";
      break;
    case "USD":
      return "usd.png";
      break;
    default:
      return "placeholder.png";
      break;
  }
}

function getExtendedName(abr) {
  switch (abr) {
    case "BCH":
      return "Bitcoin Cash";
      break;
    case "LTC":
      return "Litecoin";
      break;
    case "ETH":
      return "Ethereum";
      break;
    case "BTC":
      return "Bitcoin";
      break;
    case "GBP":
      return "British Pound";
      break;
    case "EUR":
      return "Euro";
      break;
    case "USD":
      return "US Dollar";
      break;
    default:
      return abr;
      break;
  }
}


function createRatesRow(currency) {
  const row = document.createElement("tr");
  row.classList.add("table-row");

  const colIcon = document.createElement("td");
  colIcon.setAttribute("style", "width:22%");

  const icon = document.createElement("img");
  icon.classList.add("img");
  icon.setAttribute("src", "images/" + getIcon(currency.data.base));
  icon.setAttribute("alt", "");
  colIcon.appendChild(icon);
  row.appendChild(colIcon);

  const colName = document.createElement("td");
  colName.classList.add("crypto-currency-name");
  colName.innerHTML = getExtendedName(currency.data.base);
  row.appendChild(colName);

  const colInput = document.createElement("td");
  const currencyInput = document.createElement("input");
  currencyInput.classList.add(currency.data.base + "input");
  currencyInput.classList.add("input");
  currencyInput.setAttribute("maxlength", "2");
  currencyInput.setAttribute("size", "1");
  currencyInput.setAttribute("type", "text");
  currencyInput.setAttribute("placeholder", "1");
  const textNode = document.createElement("p");
  textNode.innerHTML = " = ";

  colInput.appendChild(currencyInput);
  colInput.appendChild(textNode);
  row.appendChild(colInput);

  const colResult = document.createElement("td");
  colResult.classList.add("right");
  const resultSpan = document.createElement("span");
  resultSpan.classList.add("result-txt");
  resultSpan.classList.add(currency.data.base + "result");
  resultSpan.innerHTML = currency.data.amount;

  colResult.appendChild(resultSpan);
  row.appendChild(colResult);

  currencyInput.addEventListener("input", event => {
    const inputValue = currencyInput.value;
    const parsedValue = parseFloat(currencyInput.value);

    function showResult(currency) {
      if (
        isNaN(parsedValue) &&
        !currencyInput.value == "" &&
        !currencyInput.value == " "
      ) {
        inputBox.style.borderColor = "red";
        resultBox.textContent = "Error";
      } else {
        inputBox.style.borderColor = "transparent";
        resultSpan.innerHTML =
          getSymbol(currency.data.currency) +
          currencyInput.value * currency.data.amount;
      }
      console.log();
    }
    if (currencyInput.value == "" || currencyInput.value == " ") {
      resultBox.textContent = 1 * currency.data.amount;
    }

    showResult(currency);
  });

  const inputBox = currencyInput;
  const resultBox = resultSpan;

  return row;
}

function createAccountsRow(currency) {
  const row = document.createElement("tr");
  row.classList.add("table-row");

  const colIcon = document.createElement("td");
  colIcon.setAttribute("style", "width:10%");

  const icon = document.createElement("img");
  icon.classList.add("img");
  icon.setAttribute("src", "images/" + getIcon(currency.balance.currency));
  icon.setAttribute("alt", "");
  colIcon.appendChild(icon);
  row.appendChild(colIcon);

  const colName = document.createElement("td");
  colName.classList.add("crypto-currency-name");
  colName.innerHTML = getExtendedName(currency.balance.currency);
  row.appendChild(colName);

  const colInfo = document.createElement("td");
  const textNode = document.createElement("p");
  textNode.classList.add("base-currency-txt");
  textNode.innerHTML =
    currency.balance.amount +
    " " +
    currency.balance.currency +
    "<br>" +
    getSymbol(currency.native_balance.currency) +
    currency.native_balance.amount;
  colInfo.appendChild(textNode);
  row.appendChild(colInfo);

  console.log(getExtendedName(currency.balance.currency));
  return row;
}

function addRatesToBody(list) {
  createHeader();
  const row = document.createElement("tr");

  const subtitle = document.createElement("td");
  subtitle.classList.add("subtitle");
  subtitle.classList.add("table-row-subtitle");
  subtitle.innerHTML = "Rates";
  row.appendChild(subtitle);

  const rows = list.map(createRatesRow);
  const ratesTable = document.createElement("table");
  ratesTable.appendChild(subtitle);
  rows.forEach(item => ratesTable.appendChild(item));
  document.body.appendChild(ratesTable);
}

function addAccountsToBody(list, item) {
  const row = document.createElement("tr");
  row.classList.add("table-row");

  const subtitle = document.createElement("td");
  subtitle.classList.add("subtitle");
  subtitle.classList.add("table-row-subtitle");
  subtitle.innerHTML = "Portfolio";
  row.appendChild(subtitle);

  const rows = list.map(createAccountsRow);
  const accountsTable = document.createElement("table");
  accountsTable.appendChild(subtitle);
  rows.forEach(item => accountsTable.appendChild(item));
  document.body.appendChild(accountsTable);
}


// =========================================================================
//  Not sure how to showLogInScreen else add accounts/rates to body depending
//  on response of fetch
//  AND
//  Any other steps are needed to launch a Chrome extension
// =========================================================================

var CLIENT_ID = "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29";
var CLIENT_SECRET = "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8";
var REDIRECT_URI = "http://murphyme.co.uk/success.html";
var ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
var REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";

console.log("The webpage you want is https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID + "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) + "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all");

// if window.location = redirect_uri, check for parameters & get/store ACCESS_TOKEN_KEY
console.log(window.location);
// function

// post back to coinbase server with stored ACCESS_TOKEN_KEY attached in post req hdr

// coinbase to return json data







// If accessToken fetch data from accounts endpoint
function fetchGainAndPain() {
  var accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!accessToken)
    return restoreOriginalState(true);


  fetch('https://api.coinbase.com/v2/accounts?limit=100', {
      headers: {
        "Authorization": "Bearer " + accessToken
      },
    })
    .then(function(response) {
      if (response.status === 401)
        return refreshTokens();

      return response.json();
      console.error("200 Yay");
    })
    .then(function(json) {
      var accountData = json.data;
      return addRatesToBody(accountData);
      console.log("Nearly there");
    })
    .catch(function(err) {
      console.error('Unable to get the latest price:', err);
    });
}


// Look at redirect_uri and Make POST request to coin.../oauth/token && Send token to server
function connectCoinbase() {
  console.log("https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID + "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) + "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all");

// IDK what chrome.identity means
chrome.identity.launchWebAuthFlow({
      'url': "https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID + "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) + "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all",
      'interactive': true
    },
    function(redirect_url) {
      var code = redirect_url.split("=")[1]
      fetch('https://www.coinbase.com/oauth/token', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'CB-VERSION': '2017-05-19'
        },
        body: JSON.stringify({
          grant_type: 'authorization_code',
          code: code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          redirect_uri: REDIRECT_URI,
        })
      }).then(function(response) {
        if (response.ok) {
          response.json().then(function(data) {
            localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
            localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
            fetchGainAndPain();
          });
        }
      }).catch(function(err) {
        console.error(err);
      });
    });
}

function refreshTokens() {
  fetch('https://www.coinbase.com/oauth/token', {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: localStorage.getItem(REFRESH_TOKEN_KEY),
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
    })
  }).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
        fetchGainAndPain();
        console.log("refreshTokens.ok");

      });
    } else {
      console.log("clearTokens.ok");

    };
  }).catch(function(err) {
    console.error(err);
  });
}

function restoreOriginalState(reload) {
  localStorage.clear();
  console.log("localClear.ok");

}

document.addEventListener("DOMContentLoaded", function() {
  // Load data
  fetchGainAndPain();
  console.log("DOMContentLoaded.ok");
  showLogInScreen();
});
