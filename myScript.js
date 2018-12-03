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
const signinContent = document.getElementById("signinContent");
const extensionContent = document.getElementById("extensionContent");

// Add href to button
const signinButton = document.getElementById("signinButton");
signinButton.setAttribute(
  "href",
  "https://www.coinbase.com/oauth/authorize?client_id=" + CLIENT_ID +
  "&redirect_uri=" + encodeURIComponent(REDIRECT_URI) +
  "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
);


const aboutModal = document.getElementsByClassName("about__modal")[0];
document.addEventListener("click", function(e) {
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
  // signinContent.style.display = "none";
  // extensionContent.style.display = "block";
});

// Get currencySymbol from radio buttons
let currencySymbolToggle = document.querySelector(".currency__toggle input:checked~.currency__toggle--symbol");
let currencySymbol = currencySymbolToggle.innerHTML;
let outputs = document.getElementsByClassName("table__cell--output");
for (let i = 0; i < outputs.length; i++) {
  outputs[i].innerHTML = currencySymbol.concat(outputs[i].innerHTML);
}
// Change symbols on page when radio button selected changes
document.addEventListener("change", function(e) {
  // input symbol
  currencySymbol = e.path[1].children[1].innerHTML;
  // Make new call to server using checkd currency as param
  addRatesToBody();
  console.log(2, outputs[0].innerHTML);
  console.log(1, currencySymbol);

  for (i = 0; i < outputs.length; i++) {
    // remove existing symbol from val first, then add new one
    outputs[i].innerHTML = currencySymbol.concat(outputs[i].innerHTML);
    console.log(3, outputs[i].innerHTML, );
  }
});


function addAccountsToBody() {
  fetch('https://api.coinbase.com/v2/accounts', {
      headers: {
        "Authorization": "Bearer " + accessTokenValue,
      },
    })
    .then(response => response.json())
    .then(function(response) {
      let images = document.getElementsByClassName("cell--image");
      let names = document.getElementsByClassName("table__cell--name");
      let amounts = document.getElementsByClassName("table__cell--amount");

      const displayCodes = ["BCH", "BTC", "ETC", "ETH", "LTC", "ZRX", "USDC"];
      // response.data returns array of numbers, each is an account
      let data = response.data;
      let list = [];

      // create object (objects are not called crypto in list)
      for (let j = 0; j < data.length; j++) {
        let crypto = {
          image: `./node_modules/cryptocurrency-icons/32/white/${getIcon(data[j].currency.code)}`,
          name: getAbrName(data[j].currency.code),
          amount: `${data[j].balance.amount} ${getAbrName(data[j].currency.code)}`,
          code: getAbrName(data[j].currency.code),
        }
        // push objects to list
        list.push(crypto);
      }

      for (let i = 0; i < displayCodes.length; i++) {
        for (let j = 0; j < list.length; j++) {
          if (list[j].code.indexOf(displayCodes[i]) > -1) {
            images[i].setAttribute("src", list[j].image);
            names[i].innerHTML = list[j].name;
            amounts[i].innerHTML = list[j].amount;
          }
        }
      }




    }); // END thenable content
} // END addAccountsToBody

// get icon relevant to asset
function getIcon(abr) {
  switch (abr) {
    case "BCH":
      return "bch.png";
    case "ZRX":
      return "bch.png";
    case "LTC":
      return "ltc.png";
    case "ETH":
      return "eth.png";
    case "BTC":
      return "btc.png";
    case "BTC":
      return "btc.png";
    default:
      return "bat.png";
      break;
  }
}
// get abreviated name of asset
function getAbrName(abr) {
  switch (abr) {
    case "BCH":
      return abr;
    case "ZRX":
      return abr;
    case "ETC":
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
      let outputs = document.getElementsByClassName("table__cell--output");
      let names = document.getElementsByClassName("table__cell--assetname");

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

          names[index].innerHTML = crypto.name;
          outputs[index].innerHTML = crypto.amount;

          // on watching input for changes
          document.addEventListener("input", function(evt) {
            // target input
            let target = evt.target;
            if (target.classList.contains("cell--input")) {
              if (target.innerHTML === "" || target.innerHTML === " " || target.innerHTML === "0") {
                target.innerHTML = "1";
              }
              // product of input and rate. path[2] -selects the row, first el in last td
              let product = evt.path[2].lastElementChild;
              // If value in output is not a number, display currency value of 1 coin
              if (Number.isNaN(parseFloat(target.value))) {
                product.innerHTML = crypto.amount;
              } else {
                // Convert value to string
                let outputVal = parseFloat(target.value * crypto.amount).toString();
                // return only the first 5 characters
                product.innerHTML = outputVal.substring(0, 5);
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

        addRatesToBody();
        addAccountsToBody();
      } else {

        console.log("You probably need to login again");
        signinContent.style.display = "block";
        extensionContent.style.display = "none";
      } // END else

    });
} // END testerPoop
