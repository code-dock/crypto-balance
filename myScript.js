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
    "https://www.coinbase.com/oauth/authorize?response_type=code&client_id=522442f2d6c15f7007af2c7eaf8c59004ce8ebd28462f035acbd8137d3c6f5c4&state=1234&scope=wallet:accounts:read"
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
  if (abr === "GBP") {
    return "£";
  }

  if (abr === "USD") {
    return "$";
  }

  if (abr === "EUR") {
    return "€";
  }
  return abr;
}

function getIcon(abr) {
  if (abr === "BCH") {
    return "bch.png";
  }

  if (abr === "LTC") {
    return "ltc.png";
  }

  if (abr === "ETH") {
    return "eth.jpg";
  }

  if (abr === "BTC") {
    return "btc.png";
  }

  if (abr === "EUR") {
    return "eur.png";
  }
  if (abr === "USD") {
    return "usd.png";
  }

  return "placeholder.png";
}

function getExtendedName(abr) {
  if (abr === "BCH") {
    return "Bitcoin Cash";
  }

  if (abr === "LTC") {
    return "Litecoin";
  }

  if (abr === "ETH") {
    return "Ethereum";
  }

  if (abr === "BTC") {
    return "Bitcoin";
  }

  if (abr === "GBP") {
    return "British Pound";
  }

  if (abr === "EUR") {
    return "Euro";
  }

  if (abr === "USD") {
    return "US Dollar";
  }

  return abr;
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

// function parseAsJson(response) {
//   return response.json();
// }

fetch("http://localhost:8080/rates")
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        showLogInScreen();
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
          console.log(data);
        })
        .then(addRatesToBody);
    }
  )

  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });




//
// .then(function(response) {
//   if (response.status === 401) {
//     console.log(`Looks like a ${response.status}. Please sign in`);
//     showLogInScreen();
//     return;
//
//
//   } else if (response.status !== 401) {
//     console.log(response.status + ". Try something else");
//     response.json().then(function(data) {
//       console.log(data);
//     });
//
//     addRatesToBody();
//     return;
//   } else {
//
//   }
// })
// .then(parseAsJson)
// .catch(function(err) {
//   console.log("Fetch Error :-S", err);
// });




fetch("http://localhost:8080/accounts")
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        showLogInScreen();
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
          console.log(data);
        })
        .then(addAccountsToBody);
    }
  )

  .catch(function(err) {
    console.log('Fetch Error :-S', err);
  });



// .then(function(response) {
//   if (response.status == 401) {
//     console.log(response.status + " Please sign in");
//     return showLogInScreen();
//   }
//   response.json().then(function(data) {
//     console.log(data);
//   });
// })
// .catch(function(err) {
//   console.log("Fetch Error :-S", err);
// })
// .then(addAccountsToBody);
