/* eslint-disable */

const CLIENT_ID = "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29";
const CLIENT_SECRET = "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8";
const REDIRECT_URI = "http://murphyme.co.uk/success.html";
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";
const AUTHORIZATION_CODE = "authorization_code";

let temporaryCode = null;
let refreshTokenValue = null;
let accessTokenValue = null;
// Content Sections
let signinContent = document.getElementById("signinContent");
let extensionContent = document.getElementById("extensionContent");


// Append button to signin screen
let signinButton = document.getElementById("signinButton");
signinButton.setAttribute(
  "href",
  "https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID +
  "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
  "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
);

// Display about modal
let aboutModal = document.getElementsByClassName("about__modal")[0];
document.addEventListener("click", function(e) {
  // if about modal button pressed
  if (e.target.id === "aboutButton") {
    // toggle about modal screen
    aboutModal.classList.toggle("modal__toggle");
  }
});

//Show Login Screen
document.addEventListener("DOMContentLoaded", function(e) {
  e.preventDefault();
  signinContent.style.display = "inline-block";
  extensionContent.style.display = "none";
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
let ratesTableTitle = document.getElementsByClassName("table__title")[1];
let tableTitleCurrencySymbol = ratesTableTitle.getElementsByTagName("span")[0];
tableTitleCurrencySymbol.innerHTML = currencySymbol;

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

  tableTitleCurrencySymbol.innerHTML = currencySymbol;

  for (a = 0; a < ratesCurrencyAmounts.length; a++) {
    ratesCurrencyAmounts[a].innerHTML = ratesCurrencyAmounts[a].innerHTML.slice(1);
    ratesCurrencyAmounts[a].innerHTML = currencySymbol.concat(ratesCurrencyAmounts[a].innerHTML);
  }
});

// calculate product of input and rate
let ratesCurrencyOutputs = document.getElementsByClassName("table-rates__crypto-amount--output");
let i;
for (i = 0; i < ratesCurrencyOutputs.length; i++) {
  ratesCurrencyOutputs[i].innerHTML = "12305";
}

// on watching input for changes
document.addEventListener("input", function(evt) {
  // target input
  let target = evt.target;
  if (target.classList.contains("table-rates__amount--input")) {
    // product of input and rate. path[2] -selects the row, first el in last td
    let product = evt.path[2].lastElementChild.firstElementChild;
    // If value in output is not a number, display currency value of 1 coin
    if (Number.isNaN(parseFloat(target.value) * 20)) {
      product.innerHTML = "1234";
    } else {
      // Convert value to string
      let outputValue = parseFloat(target.value * 20).toString();
      // return only the first 5 characters
      product.innerHTML = outputValue.substring(0, 5);
    }
  }
}); // END watching input



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

function getIcon(abr) {
  switch (abr) {
    case "BCH":
      return "bch60.png";
    case "LTC":
      return "ltc60.png";
      break;
    case "ETH":
      return "eth60.png";
      break;
    case "BTC":
      return "btc60.png";
      break;
    default:
      return "placeholder.png";
      break;
  }
}


//Check urls
chrome.tabs.query({}, function(tabs) {
  let i;
  for (i = 0; i < tabs.length; i++) {

    if (tabs[i].url.includes(REDIRECT_URI)) {
      // Split url
      let splitUrl = tabs[i].url.split("?");
      let params = splitUrl[1];
      // Split params
      let splitParams = params.split("=");
      let value = params.split("=")[1];
      // Store authorization_code
      localStorage.setItem(AUTHORIZATION_CODE, value);
      temporaryCode = localStorage.getItem(AUTHORIZATION_CODE);

      testerPoop();
    }
  }
});


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
        signinContent.style.display = "none";
      } else {
        signinContent.style.display = "block";
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
