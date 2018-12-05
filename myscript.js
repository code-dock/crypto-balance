let cc = {
  CLIENT_SECRET: "55404ab2ea23a6737b68100211c774e86087ee6fc79ab285533a62731be77eb8",
  CLIENT_ID: "ce5a268500cd300dd697e9419ba4800d1236477c1b77f1b4c043dee5266dfa29",
  REDIRECT_URI: "https://murphyme.co.uk/success",

  displayed: ["BCH", "BTC", "ETC", "ETH", "LTC", "ZRX"],
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
    const aboutButton = document.getElementById("aboutButton");
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
  changeCurrency: () => {
    // return new value
  },
  fetchData: {
    accounts: {
      url: "https://api.coinbase.com/v2/accounts",
      headers: {
        "Authorization": "Bearer "
        // + cc.accessToken
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
          tempCode = localStorage.getItem(cc.authorization_code);

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
          console.log(obj);
          // On successful POST request   ???? ******

          cc.isLoggedIn = true;
          // Store ACCESS_TOKEN and REFRESH_TOKEN
          localStorage.setItem(cc.refresh_token, obj.refresh_token);
          cc.refreshToken = localStorage.getItem(cc.refresh_token);
          localStorage.setItem(cc.access_token, obj.access_token);
          cc.accessToken = localStorage.getItem(cc.access_token);

          cc.changeScreen();
          cc.getAccounts();
          cc.getPrices();

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
                  console.log("Let's refresh");
                  // On successful POST request   ???? ******

                  cc.isLoggedIn = true;
                  // Store ACCESS_TOKEN and REFRESH_TOKEN
                  localStorage.setItem(cc.refresh_token, obj.refresh_token);
                  cc.refreshToken = localStorage.getItem(cc.refresh_token);
                  localStorage.setItem(cc.access_token, obj.access_token);
                  cc.accessToken = localStorage.getItem(cc.access_token);

                  cc.getAccounts();
                  cc.getPrices();

                }); // END then exchange tokens
            }, 6000); // END timeout
          }
          refresh();

        }); // END then handle obj
    };
  },
  getAccounts: () => {
    // console.log("getAccounts");
    // console.log(cc.fetchData.accounts.url);
    // console.log(cc.fetchData.accounts.headers);

    // fetch(cc.fetchData.accounts.url, {
    //     headers: {
    //       cc.fetchData.accounts
    //     },
    //   })
    //   .then(response => response.json())
    //   .then(obj => {
    //     console.log(obj);
    //   });
  },
  getPrices: () => {
    console.log("getPrices");

    let outputs = document.getElementsByClassName("table__cell--output");
    let names = document.getElementsByClassName("table__cell--assetname");

    fetch(cc.fetchData.prices.url)
      .then(response => response.json())
      .then(obj => {
        // Show rates of selected currency
        let rates = obj.data.rates;
        // Keys/Values from rates
        const keys = Object.keys(rates);
        const vals = Object.values(rates);
        let arr = [];

        // compare items in both arrays and build a new array
        for (let i = 0; i < cc.displayed.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (arr[j].code.indexOf(cc.displayed[i]) > -1) {
              let crypto = {
                name: key,
                amount: vals[index],
              }
              arr.push(crypto);
              console.log(arr[j]);
            } // END If crypto is in data array
          } // END data array
        } // END cc.displayed loop

      }); // END then clause
  },

  appendToAccountsTable: () => {
    // get icon relevant to asset
    function getThumbnail(abr) {
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
        default:
          return "bat.png";
          break;
      }
    }

  },
}
cc.init();
