/* eslint-disable */

function parseAsJson(response) {
  return response.json();
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
    return "Etherium";
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
  const row = document.createElement("tr");

  const subtitle = document.createElement("td");
  subtitle.classList.add("subtitle");
  subtitle.classList.add("table-row-subtitle");
  subtitle.innerHTML = "Rates";
  row.appendChild(subtitle);

  const rows = list.map(createRatesRow);
  const ratesTable = document.createElement("table");
  // innerHTML.table = createSubtitle(name);
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

fetch("http://localhost:8080/rates")
  .then(parseAsJson)
  .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
  .then(parseAsJson)
  .then(addAccountsToBody);
