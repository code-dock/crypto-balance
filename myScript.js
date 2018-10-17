/* eslint-disable */

// Info for using app
const CLIENT_ID = "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29";
const CLIENT_SECRET = "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8";
const REDIRECT_URI = "http://murphyme.co.uk/success.html";
const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
const REFRESH_TOKEN_KEY = "REFRESH_TOKEN_KEY";
const authorization_code = "authorization_code";

let temporaryCode = null;
let refreshTokenValue = null;
let accessTokenValue = null;

// Content Sections
let signinContent = document.getElementById("signinContent");
let extensionContent = document.getElementById("extensionContent");

// Add href to button
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
currencySymbol = currencySymbolToggle.innerHTML;
tableTitleCurrencySymbol.innerHTML = currencySymbol;

let ratesCurrencyAmounts = document.getElementsByClassName("table-rates__amount");
for (a = 0; a < ratesCurrencyAmounts.length; a++) {
  ratesCurrencyAmounts[a].innerHTML = currencySymbol.concat(ratesCurrencyAmounts[a].innerHTML);
}

document.addEventListener("change", function() {
  // Set currencySymbol from radio buttons
  currencySymbolToggle = document.querySelector(".table__currency-toggle input:checked~.table__currency-toggle--symbol");
  currencySymbol = currencySymbolToggle.innerHTML;

  // Make a new call to endpoint using relevant currency in params
  addRatesToBody();

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


// function addAccountsToBody() {
//   fetch('https://api.coinbase.com/v2/accounts', {
//       headers: {
//         "Authorization": "Bearer " + accessTokenValue,
//       },
//     })
//     .then(response => response.json())
//     .then(function(response) {
//       let currencyAmounts = document.getElementsByClassName("table-accounts__currency-amount");
//       let currencyChanges = document.getElementsByClassName("table-accounts__currency-change");
//       // response.data returns array of numbers, each is an account
//       let accounts = response.data;
//
//       // console.log(accounts);
//
//       // loop through accounts
//       accounts.forEach((account, index) => {
//         // Select relevant image
//         let icons = document.getElementsByClassName("placeholder");
//         icons[index].setAttribute("src", `images/${getIcon(account.balance.currency)}`);
//         // Set currency amount in cell
//         let cryptoAmounts = document.getElementsByClassName("table-accounts__crypto-amount");
//         cryptoAmounts[index].innerHTML = account.balance.amount;
//       });
//
//       // // account icon
//       // icons[key].innerHTML = `images/${getIcon(value.balance.currency)}`;
//       // // crypto amount
//       // cryptoAmounts[key].innerHTML = value.balance.amount;
//       // // value of crypto
//       // currencyAmounts[key].innerHTML = value.balance.currency;
//       // // value change
//       // currencyChanges[key].innerHTML = value.
//     });
// }

// get icon relevant to asset
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
// get abreviated name of asset
function getAbrName(abr) {
  switch (abr) {
    case "BCH":
      return abr;
    case "LTC":
      return abr;
      break;
    case "ETH":
      return abr;
      break;
    case "BTC":
      return abr;
      break;
    default:
      return "Jack";
      break;
  }
}


function addRatesToBody() {
  fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${getSymbol(currencySymbol)}`)
    .then(response => response.json())
    .then(response => {
      let ratesOutputs = document.getElementsByClassName("table-rates__crypto-amount--output");
      let ratesCryptoAbrNames = document.getElementsByClassName("table-rates__crypto-code");

      // Show rates of selected currency
      let rates = response.data.rates;
      // Keys from rates
      const keys = Object.keys(rates);
      // Values from rates
      const vals = Object.values(rates);
      // Array of cryptos displayed in rates table
      const assets = ["BCH", "BTC", "ETC", "ETH", "LTC"];
      // New array
      let list = [];

      // compare items in both arrays and build a new array
      keys.forEach((key) => assets.forEach((asset, index) => {
        if (key === asset) {
          let crypto = {
            name: key,
            amount: vals[index],
          }
          list.push(crypto);

          ratesCryptoAbrNames[index].innerHTML = crypto.name;
          ratesOutputs[index].innerHTML = crypto.amount;

          // on watching input for changes
          document.addEventListener("input", function(evt) {
            // target input
            let target = evt.target;
            if (target.classList.contains("table-rates__amount--input")) {
              if (target.innerHTML === "" || target.innerHTML === " " || target.innerHTML === "0") {
                target.innerHTML = "1";
              }
              // product of input and rate. path[2] -selects the row, first el in last td
              let product = evt.path[2].lastElementChild.firstElementChild;
              // If value in output is not a number, display currency value of 1 coin
              if (Number.isNaN(parseFloat(target.value))) {
                product.innerHTML = crypto.amount;
              } else {
                // Convert value to string
                let outputValue = parseFloat(target.value * crypto.amount).toString();
                // return only the first 5 characters
                product.innerHTML = outputValue.substring(0, 5);
              }
            }
          }); // END watching input

        } // END compare arrays IF
      })); // END compare arrays forEach

    }); // END then clause
} // END addRatesToBody function

// get selected symbol from radio buttons and return code
function getSymbol(sym) {
  switch (sym) {
    case "$":
      return "USD";
      break;
    case "£":
      return "GBP";
      break;
    case "€":
      return "EUR";
      break;
    default:
      return "USD";
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
      localStorage.setItem(authorization_code, value);
      temporaryCode = localStorage.getItem(authorization_code);

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
        extensionContent.style.display = "block";
      } else {
        // signinContent.style.display = "block";
        // extensionContent.style.display = "none";
        // console.log("You probably need to login again");
        signinContent.style.display = "none";
        extensionContent.style.display = "block";
      } // END else

    })
    .then(function() {
      addRatesToBody();
      // addAccountsToBody();
    });
} // END testerPoop
