let cc = {
  CLIENT_SECRET: "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8",
  CLIENT_ID: "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29",
  REDIRECT_URI: "https://murphyme.co.uk/success",

  // displayed: ["BCH", "BTC", "ETC", "ETH", "LTC", "ZRX"],
  cbArr: [{
      code: "BCH",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
    {
      code: "BTC",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
    {
      code: "ETC",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
    {
      code: "ETH",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
    {
      code: "LTC",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
    {
      code: "ZRX",
      walName: "",
      icon: "",
      qty: null,
      val: null,
    },
  ],
  authorization_code: "authorization_code",
  tempCode: "",
  access_token: "access_token",
  accessToken: "",
  refresh_token: "refresh_token",
  refreshToken: "",
  // haven't got access/refresh tokens
  isLoggedIn: false,

  init: () => {
    cc.modal();
    cc.changeScreen();
    cc.changeCurrency();
    cc.redirectParams();
    cc.encodeSigninLink();
  },

  encodeSigninLink: () => {
    // Add href to button
    const signinButton = document.getElementById("signinButton");
    signinButton.setAttribute(
      "href",
      "https://www.coinbase.com/oauth/authorize?client_id=" + cc.CLIENT_ID +
      "&redirect_uri=" + encodeURIComponent(cc.REDIRECT_URI) +
      "&response_type=code&scope=wallet%3Aaccounts%3Aread&account=all"
    );
  },

  // shows 'about' modal
  modal: () => {
    let aboutButton = document.getElementById("aboutButton");
    aboutButton.addEventListener("click", function(e) {
      e.preventDefault();
      let parent = e.target.parentNode;
      let auntie = parent.nextElementSibling;
      auntie.classList.toggle("top");
    });
  },

  // moves between login screen and accounts
  changeScreen: () => {
    let signinContent = document.body.children[0];
    let extensionContent = document.body.children[1];
    let footer = document.body.children[2];

    if (cc.isLoggedIn) {
      signinContent.classList.remove("visible");
      extensionContent.classList.add("visible");
      footer.classList.remove("footer--blue");

    } else {
      signinContent.classList.add("visible");
      extensionContent.classList.remove("visible");
      footer.classList.add("footer--blue");

    }
  },

  // Get currencySymbol from radio buttons
  changeCurrency: () => {
    let checkedSymbol = document.querySelector(".currency__toggle input:checked~.currency__toggle--symbol");
    let symbol = getSymbol(checkedSymbol.innerHTML);

    function getSymbol(sym) {
      switch (sym) {
        case "USD":
          return "US$";
          break;
        case "GBP":
          return "£";
          break;
        case "EUR":
          return "€";
          break;
        default:
          return "US$";
          break;
      }
    }
    return symbol;
  },

  // x * y = output
  multiply: (a, b) => {
    return a * b;
  },

  fetchData: {
    accounts: {
      url: "https://api.coinbase.com/v2/accounts",
      options: {
        headers: {
          "Authorization": "Bearer "
          // + cc.accessToken
        },
      },
    },
    prices: {
      // Append currency name to end
      url: "https://api.coinbase.com/v2/exchange-rates?currency=",
    },
  },

  redirectParams: () => {
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
          cc.tempCode = localStorage.getItem(cc.authorization_code);

          // stay logged in fn
          cc.login();
        }
      }
    });
  },

  login: () => {
    if (!cc.isLoggedIn) {
      // try to log in
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
          cc.isLoggedIn = true;
          // Store ACCESS_TOKEN and REFRESH_TOKEN
          localStorage.setItem(cc.access_token, obj.access_token);
          localStorage.setItem(cc.refresh_token, obj.refresh_token);
          cc.accessToken = localStorage.getItem(cc.access_token);
          cc.refreshToken = localStorage.getItem(cc.refresh_token);


          setInterval(() => {
            console.log("int");
            cc.refresh();
          }, 6000); // END setInterval

        }); // END then handle obj
    };
  },
  // Set timeout of time until tokens expire
  refresh: () => {
    fetch("https://api.coinbase.com/oauth/token" +
        "?grant_type=refresh_token" +
        "&refresh_token=" + cc.refreshToken +
        "&client_id=" + cc.CLIENT_ID +
        "&client_secret=" + cc.CLIENT_SECRET, {
          method: "POST",
        })
      .then(response => response.json())
      .then(obj => {
        // On successful POST request   ???? ******

        cc.isLoggedIn = true;
        // Store ACCESS_TOKEN and REFRESH_TOKEN
        localStorage.setItem(cc.refresh_token, obj.refresh_token);
        localStorage.setItem(cc.access_token, obj.access_token);
        cc.refreshToken = localStorage.getItem(cc.refresh_token);
        cc.accessToken = localStorage.getItem(cc.access_token);

        cc.changeScreen();
        cc.getAccounts();
        cc.getPrices();
        cc.createAccountsRow();
      }); // END then exchange tokens
  },
  getPrices: () => {
    // Change symbols on page when radio button selected changes
    let currency = document.getElementsByClassName("currency")[0];
    let currencySymbol = null;
    currency.addEventListener("change", function(e) {
      currencySymbol = cc.changeCurrency();
    });

    // fetch(cc.fetchData.prices.url + currencySymbol)
    fetch(cc.fetchData.prices.url + "USD")
      .then(response => response.json())
      .then(obj => {
        // Show rates of selected currency
        let rates = obj.data.rates;
        // Keys/Values from rates
        const keys = Object.keys(rates);
        const vals = Object.values(rates);

        // compare items in both arrays and build a new array
        for (let i = 0; i < cc.cbArr.length; i++) {
          for (let j = 0; j < keys.length; j++) {
            if (keys[j].indexOf(cc.cbArr[i].code) > -1) {
              cc.cbArr[i].val = vals[j];
            } // END If crypto is in data array
          } // END data array Loop
        } // END cc.displayed loop

      }); // END then clause
  },
  getAccounts: () => {
    fetch(cc.fetchData.accounts.url, {
        headers: {
          "Authorization": "Bearer " + cc.accessToken,
        },
      })
      // fetch(cc.fetchData.prices.url + currencySymbol)
      .then(response => response.json())
      .then(obj => {
        // Show rates of selected currency
        let data = obj.data;

        // compare items in both arrays and build a new array
        for (let i = 0; i < cc.cbArr.length; i++) {
          for (let j = 0; j < data.length; j++) {

            if (data[j].currency.code.indexOf(cc.cbArr[i].code) > -1) {
              cc.cbArr[i].walName = data[j].name;
              cc.cbArr[i].icon = `./node_modules/cryptocurrency-icons/32/color/${getIcon(data[j].currency.code)}`;
              cc.cbArr[i].qty = `${data[j].balance.amount}`;
            } // END If crypto is in data array
          } // END data array Loop
        } // END cc.displayed loop
      }); // END then clause

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
    };

  },

  createAccountsRow: () => {
    console.log("code:", cc.cbArr[2].code);
    console.log("qty:", cc.cbArr[2].qty);
    console.log("val:", cc.cbArr[2].val);
    // create tr, append to table
    let row = document.createElement("tr");
    row.innerHTML =
      `<td class="table__cell--imagehldr">
      <img class="cell--image" src=${cc.cbArr[2].icon} /> </td>
      <td class="table__cell--wallet"> ${cc.cbArr[2].walName} </td>
      <td class="table__cell--worth">
      <span class="table__cell--value">${cc.cbArr[2].val}</span><br>
      <span class="table__cell--quantity">${cc.cbArr[2].qty}</span></td>`;
    // return row;
  },
};
document.body.addEventListener("DOMContentLoaded", cc.init());
