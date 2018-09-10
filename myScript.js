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
  icon.setAttribute("src", "images/" + getIcon(currency.data.rates));
  icon.setAttribute("alt", "");
  colIcon.appendChild(icon);
  row.appendChild(colIcon);

  const colName = document.createElement("td");
  colName.classList.add("crypto-currency-name");
  colName.innerHTML = getExtendedName(currency.data.rates);
  row.appendChild(colName);

  const colInput = document.createElement("td");
  const currencyInput = document.createElement("input");
  currencyInput.classList.add(currency.data.rates + "input");
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
  resultSpan.classList.add(currency.data.rates + "result");
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

  // console.log(getExtendedName(currency.balance.currency));
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

//
// var CLIENT_ID = "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29",
//   CLIENT_SECRET = "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8",
//   REDIRECT_URI = "http://murphyme.co.uk/success.html",
//   ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY",
//   REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY",
//   authorization_code = "authorization_code",
//   refresh_token = "refresh_token";
//
// // Show Login Screen
// document.addEventListener("DOMContentLoaded", showLogInScreen);
//
// // Check urls
// chrome.tabs.query({}, function(tabs) {
//   var i;
//   for (i = 0; i < tabs.length; i++) {
//     var tab = tabs[i];
//     if (tab.url.includes(REDIRECT_URI)) {
//       // Split url
//       var splitUrl = tab.url.split("?"),
//         params = splitUrl[1];
//       // Split params
//       var splitParams = params.split("="),
//         value = params.split("=")[1];
//       // Store authorization_code
//       localStorage.setItem(authorization_code, value);
//       break;
//     }
//   }
//   var temporaryCode = localStorage.getItem(authorization_code);
//   // Make post request to Coinbase server with grant_type= authorization_code
//   exchangeAuthorizationCode(temporaryCode);
// });
//
// function exchangeAuthorizationCode(temporaryCode) {
//   fetch('https://api.coinbase.com/oauth/token' +
//     "?grant_type=" + authorization_code +
//     "&code=" + temporaryCode +
//     "&client_id=" + CLIENT_ID +
//     "&client_secret=" + CLIENT_SECRET +
//     "&redirect_uri=" + REDIRECT_URI, {
//       method: 'post',
//       headers: {
//         'CB-VERSION': '2017-05-19'
//       }
//     }).then(function(response) {
//     console.log("first request success");
//     // IF response is successful,
//     if (response.status === 200) {
//       //// Turn response into a JSON object
//       response.json();
//       //// Store ACCESS_TOKEN and REFRESH_TOKEN
//       localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
//       localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
//       var currentRefreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
//       var currentAccessTokenValue = localStorage.getItem(ACCESS_TOKEN_KEY);
//
// ***// Create html
//
//    // Show data in html
//
//       // ELSE IF response is unauthorised && ACCESS_TOKEN/REFRESH_TOKEN already stored in localStorage,
//     } else if (response.status === 401 && response.access_token === 'undefined') {
//       //// Make post request to Coinbase server,
//       //// Use currentRefreshTokenValue to get new tokens
//       fetch('https://api.coinbase.com/oauth/token' +
//           "?grant_type=" + refresh_token +
//           "&refresh_token=" + currentRefreshTokenValue +
//           "&client_id=" + CLIENT_ID +
//           "&client_secret=" + CLIENT_SECRET, {
//             method: 'post',
//             headers: {
//               'CB-VERSION': '2017-05-19'
//             }
//           })
//         .then(function(response) {
//           console.log(response);
//         });
//

//     }
//     // ELSE IF unauthorised && no ACCESS_TOKEN/REFRESH_TOKEN in localStorage,
//     //// Make initial POST request again to get tokens
//   });
// }

// IF session not expired,
//// Make POST request with ACCESS_TOKEN in header to retrieve data
//// Remove Login screen
//// Show Wallets and exchange rates page
// ELSE IF session expired,
//// Use stored REFRESH_TOKEN to get new tokens
//// Make POST request with ACCESS_TOKEN in header to retrieve data
// Create html
// Show data in html


// function retrieveJSONData() {
//   fetch('https://api.coinbase.com/v2/currencies', {
//       headers: {
//         "Authorization": "Bearer " + accessTokenValue
//       },
//     })
//     .then(function(response) {
//       console.log("Retrieving");
//     })
// }


fetch('https://api.coinbase.com/v2/exchange-rates?currency=GBP')
  .then(response => response.json())
  .then(function(response) {
    var i, rates = response.data.rates,
      rateNames = Object.keys(rates),
      rateValues = Object.values(rates);

    for (i = 0; i < rateNames.length; i++) {
      getCurrencyName(rateNames[i], rateValues[i]);
    }
  });


function getCurrencyName(abr, val) {
  switch (abr) {
    case "BTC":
    console.log(`${abr} is worth ${val}`);
      return "BTC";
      break;
    case "ETH":
    console.log(`${abr} is worth ${val}`);
      return "ETH";
      break;
    case "USD":
    console.log(`${abr} is worth ${val}`);
      return "USD";
      break;
    case "BCH":
    console.log(`${abr} is worth ${val}`);
      return "BCH";
      break;
    case "LTC":
    console.log(`${abr} is worth ${val}`);
      return "LTC";
      break;
    default:
  }
}



// Show Login Screen

// Check urls
// Split url to get params
// Store authorization_code

// Make post request to Coinbase server with grant_type= authorization_code
// IF response is successful,
//// Turn response into a JSON object
//// Store ACCESS_TOKEN and REFRESH_TOKEN
// ELSE IF response is unauthorised && ACCESS_TOKEN/REFRESH_TOKEN already stored in localStorage,
//// Make post request to Coinbase server,
//// Use stored REFRESH_TOKEN to get new tokens
// ELSE IF unauthorised && no ACCESS_TOKEN/REFRESH_TOKEN in localStorage,
//// Make initial POST request again to get tokens

// IF session not expired,
//// Make POST request with ACCESS_TOKEN in header to retrieve data
//// Remove Login screen
//// Show Wallets and exchange rates page
// ELSE IF session expired,
//// Use stored REFRESH_TOKEN to get new tokens
//// Make POST request with ACCESS_TOKEN in header to retrieve data






// if object status = 401, post req using refresh access_token
// if (response.status === 401) {
//   console.log(response.status + ' problem. Please log in again');
//
//   fetch('https://api.coinbase.com/oauth/token' + "?grant_type=" + refresh_token + "&refresh_token=" + refreshTokenValue + "&client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET, {
//       method: 'post',
//       headers: {
//         'CB-VERSION': '2017-05-19'
//       }
//     })
//     .then(function(response) {
//       console.log(response);
//     });
//   // retrieveJSONData(refreshToken);
//
// } else if (response.status === 200) {
//
//   console.log(response.status + ' yay!!');
//   // Convert response into JSON
//   response.json();
//   console.log(response.json());
//
//   localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
//   localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
//   console.log(`response.access_token = ${response.access_token}`);
//   console.log(`response.refresh_token = ${response.refresh_token}`);
//
//   var accessTokenValue = localStorage.getItem(ACCESS_TOKEN_KEY),
//     refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
//   retrieveJSONData();
// }
