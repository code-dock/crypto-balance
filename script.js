// Content Sections

let cc = {
  SIGNIN_CONTENT: document.getElementById("signinContent"),
  EXTENSION_CONTENT: document.getElementById("extensionContent"),
  FOOTER: document.getElementsByClassName("footer")[0],
  // Info for using app
  CLIENT_ID: "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29",
  CLIENT_SECRET: "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8",
  REDIRECT_URI: "https://murphyme.co.uk/success",

  ACCESS_TOKEN: "ACCESS_TOKEN",
  accessToken: "",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  refreshToken: "",
  authorization_code: "authorization_code",
  tempCode: "",
  SELECTED: ["BCH", "BTC", "ETC", "ETH", "LTC", "ZRX", ],
  isLoggedin: false,
  t: "",

  init: () => {

    cc.toggleContent();
    cc.toggleAbout();
    cc.toggleCurrency();

  },

  toggleContent: () => {
    console.log("Not Logged in");
    cc.SIGNIN_CONTENT.classList.add("visible");
    cc.EXTENSION_CONTENT.classList.remove("visible");
    cc.FOOTER.classList.add("footer--blue");
    let footerLink = document.getElementsByClassName("menu__link");
    footerLink[0].classList.add("footer--blue");

    cc.getAccounts();

    // Add href to button
    const signinButton = document.getElementById("signinButton");
    signinButton.setAttribute(
      "href",
      "https://www.coinbase.com/oauth/authorize?client_id=" + cc.CLIENT_ID +
      "&redirect_uri=" + encodeURIComponent(cc.REDIRECT_URI) +
      "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
    );

    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url.includes(cc.REDIRECT_URI)) {
          cc.getParams();
        }
      }
    });
  },

  toggleAbout: () => {
    const aboutButton = document.getElementById("aboutButton");
    const aboutModal = document.getElementsByClassName("about__modal")[0];
    // toggle about modal screen
    aboutButton.addEventListener("click", function(e) {
      aboutModal.classList.toggle("modal__toggle");
    });
  },

  login: () => {

    if (cc.isLoggedIn) {
      console.log("Not Logged in");
      cc.SIGNIN_CONTENT.classList.add("visible");
      cc.EXTENSION_CONTENT.classList.remove("visible");
      cc.FOOTER.classList.add("footer--blue");
      let footerLink = document.getElementsByClassName("menu__link");
      footerLink[0].classList.remove("footer--blue");

      cc.getAccounts();
      // cc.getPrices();
    } else {
      console.log("Logged in");
      // exchange temp code for auth/refresh codes
      cc.tempCode = localStorage.getItem(cc.authorization_code);
      fetch("https://api.coinbase.com/oauth/token" +
          "?grant_type=" + cc.authorization_code +
          "&code=" + cc.tempCode +
          "&client_id=" + cc.CLIENT_ID +
          "&client_secret=" + cc.CLIENT_SECRET +
          "&redirect_uri=" + cc.REDIRECT_URI, {
            method: "POST",
            headers: {
              "CB-Version": "2018-09-26"
            }
          })
        .then(response => response.json())
        .then(obj => {
          cc.t = obj.expires_in;
          // Store ACCESS_TOKEN and REFRESH_TOKEN
          localStorage.setItem(cc.REFRESH_TOKEN, obj.refresh_token);
          localStorage.setItem(cc.ACCESS_TOKEN, obj.access_token);
          cc.refreshToken = localStorage.getItem(cc.REFRESH_TOKEN);
          cc.accessToken = localStorage.getItem(cc.ACCESS_TOKEN);

          cc.SIGNIN_CONTENT.classList.remove("visible");
          cc.EXTENSION_CONTENT.classList.add("visible");
          cc.FOOTER.classList.remove("footer--blue");
          let footerLink = document.getElementsByClassName("menu__link");
          footerLink[0].classList.remove("footer--blue");

          cc.getAccounts();
          // cc.getPrices();

          // Set timeout of time until tokens expire
          function refresh() {
            setInterval(() => {
              fetch("https://api.coinbase.com/oauth/token" +
                  "?grant_type=refresh_token" +
                  "&refresh_token=" + cc.refreshToken +
                  "&client_id=" + cc.CLIENT_ID +
                  "&client_secret=" + cc.CLIENT_SECRET, {
                    method: "POST",
                  })
                .then(response => response.json())
                .then(obj => {
                  // Store ACCESS_TOKEN and REFRESH_TOKEN
                  localStorage.setItem(cc.REFRESH_TOKEN, obj.refresh_token);
                  localStorage.setItem(cc.ACCESS_TOKEN, obj.access_token);
                  cc.refreshToken = localStorage.getItem(cc.REFRESH_TOKEN);
                  cc.accessToken = localStorage.getItem(cc.ACCESS_TOKEN);
                  // **** Add classes
                  cc.SIGNIN_CONTENT.style.display = "none";
                  cc.EXTENSION_CONTENT.style.display = "block";

                  // cc.getAccounts();
                  console.log("Let's refresh");
                }); // END then exchange tokens
            }, cc.t); // END timeout
            isLoggedIn = true;
          }
          refresh();

        }); // END then handle obj
    } // END If not logged in

  },

  getParams: () => {
    //Check urls
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {

        if (tabs[i].url.includes(cc.REDIRECT_URI)) {
          // Split url
          let splitUrl = tabs[i].url.split("?");
          let params = splitUrl[1];
          // Split params
          let splitParams = params.split("=");
          let value = params.split("=")[1];
          // Store authorization_code
          localStorage.setItem(cc.authorization_code, value);
          // tempCode = localStorage.getItem(cc.authorization_code);

          // stay logged in fn
          cc.login();

        }
      }
    });
  }, // END getParams fn

  // get abreviated name of asset
  getAbrName: (abr) => {
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
        return "TBC";
        break;
    }
  },

  getAccounts: () => {
    console.log("getAccounts");
    // Other header info needed?? *******************
    fetch('https://api.coinbase.com/v2/accounts', {
        headers: {
          "Authorization": "Bearer " + cc.accessToken,
        },
      })
      .then(response => response.json())
      .then(function(response) {
        // response.data returns array of numbers, each is an account
        let data = response.data;
        console.log(response.data);
        let dataSelected = [];
        // create object (objects are not called crypto in dataSelected)
        for (let j = 0; j < data.length; j++) {
          let crypto = {
            image: `./node_modules/cryptocurrency-icons/32/color/${getIcon(data[j].currency.code)}`,
            name: data[j].name,
            amount: `${data[j].balance.amount} ${cc.getAbrName(data[j].currency.code)}`,
            code: cc.getAbrName(data[j].currency.code),
          }
          // push objects to list
          dataSelected.push(crypto);
        }

        for (let i = 0; i < cc.SELECTED.length; i++) {
          for (let j = 0; j < dataSelected.length; j++) {
            if (dataSelected[j].code.indexOf(cc.SELECTED[i]) > -1) {
              // NEEDS Argument *********
              cc.buildAccountsTable(dataSelected[j]);
            }
          }
        }

      }); // END thenable content


    // get icon relevant to asset
    function getIcon(abr) {
      switch (abr) {
        case "BCH":
          return "bch.png";
        case "ZRX":
          return "zrx.png";
        case "LTC":
          return "ltc.png";
        case "ETH":
          return "eth.png";
        case "ETC":
          return "etc.png";
        case "BTC":
          return "btc.png";
        case "USDC":
          return "usdc.png";
        default:
          return "bat.png";
          break;
      }
    }

  },

  getPrices: () => {
    console.log("getPrices");

    let outputs = document.getElementsByClassName("table__cell--output");
    let names = document.getElementsByClassName("table__cell--assetname");

    fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${cc.getSymbol(cc.currencySymbol)}`)
      .then(response => response.json())
      .then(response => {
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

          } // END compare arrays IF
        })); // END compare arrays forEach

      }); // END then clause
    cc.calcPricesProduct();
  },
  //
  buildAccountsTable: (account) => {
    // append to accounts table, display 3 accounts and more on btn toggle
    let accountsTable = document.getElementsByClassName("accounts")[0];

    // create tr, append to table
    let row = document.createElement("tr");
    if (accountsTable.children || accountsTable.children === 0) {
      row.innerHTML =
        `<td class="table__cell--imagehldr">
      <img class="cell--image" src="${account.image}" /></td>
      <td class="table__cell--name">${account.name}</td>
      <td class="table__cell--amount">${account.name}<br><span class="table__cell--value">${account.amount}</span></td>`;
      accountsTable.appendChild(row);
    } else {
      row.innerHTML += "";
    }
  },
  // Remake requests with GBP,USD, EUR in params,
  // append to prices and account vals
  toggleCurrency: () => {
    console.log("toggleCurrency");

    // Get currencySymbol from radio buttons
    let currency = document.getElementsByClassName("currency")[0];
    // Traversing may be better?? ***********************************
    let currencySymbolToggle = document.querySelector(".currency__toggle input:checked~.currency__toggle--symbol");
    let currencySymbol = currencySymbolToggle.innerHTML;
    // Add symbol to amount ***********************************
    for (let i = 0; i < outputs.length; i++) {
      outputs[i].innerHTML = currencySymbol.concat(outputs[i].innerHTML);
    }

    // Change symbols on page when radio button selected changes
    currency.addEventListener("change", function(e) {
      // input symbol
      currencySymbol = e.path[1].children[1].innerHTML;
      console.log(currencySymbol);
      for (i = 0; i < outputs.length; i++) {
        // remove existing symbol from val first, then add new one
        outputs[i].innerHTML = currencySymbol.concat(outputs[i].innerHTML);
      }
    });

  },
  // get selected symbol from radio buttons and return code
  getSymbol: (sym) => {
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

  },
  // x * y = output
  calc: (crypto, outputClass) => {
    let output = document.getElementsByClassName(output);
    // If value in output is not a number, display currency value of 1 coin
    if (Number.isNaN(parseFloat(target.value))) {
      product.innerHTML = crypto.amount;
    } else {
      // Convert value to string
      let outputVal = parseFloat(target.value * crypto.amount).toString();
      // return only the first 5 characters
      product.innerHTML = outputVal.substring(0, 5);
    }
  },
};

cc.init();
