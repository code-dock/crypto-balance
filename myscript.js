// let fetchData = {
//   accounts: {
//     endpoint: "https://api.coinbase.com/v2/accounts",
//     headers: {
//       "Authorization": "Bearer " + cc.accessToken,
//     }
//   },
//   prices: {
//     // Append currency name to end
//     endpoint: "https://api.coinbase.com/v2/exchange-rates?currency=",
//   },
// };

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
  },
  // shows 'about' modal
  modal: () => {
    const aboutButton = document.getElementById("aboutButton");
    aboutButton.addEventListener("click", function(e) {
      e.preventDefault();
      console.log(e);
      e.target.nextElementSibling.classList.toggle("show");
    });
  },
  // moves between login screen and accounts
  changeScreen: () => {

  },
  changeCurrency: () => {
    // return new value
  },
  params: () => {
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
  },
  login: () => {
    if (!isLoggedIn) {
      // try to log in

    } else {

    }
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
