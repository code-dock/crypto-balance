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
function createRow(currency) {
  const row = document.createElement("tr");

  const colName = document.createElement("td");
  colName.innerHTML = currency.name;
  row.appendChild(colName);

  const colInput = document.createElement("td");
  const currencyInput = document.createElement("input");
  currencyInput.classList.add(currency.inputClass);
  currencyInput.setAttribute("type", "text");
  colInput.appendChild(currencyInput);
  row.appendChild(colInput);

  const colResult = document.createElement("td");
  const resultSpan = document.createElement("span");
  resultSpan.classList.add(currency.resultClass);
  colResult.appendChild(resultSpan);
  row.appendChild(colResult);

  currencyInput.addEventListener("input", event => {
    const inputValue = currencyInput.value;
    const parsedValue = parseFloat(currencyInput.value);

    function showResult() {
      if (isNaN(parsedValue)) {
        inputBox.style.borderColor = "red";
        resultBox.textContent = "Error";
      } else if (inputValue == " ") {
        resultBox.textContent = " ";
      } else {
        inputBox.style.borderColor = "transparent";
        resultSpan.innerHTML = currencyInput.value * currency.rate;
      }
    }
    console.log(isNaN(parsedValue));
    showResult();
  });

  const inputBox = currencyInput;
  const resultBox = resultSpan;

  return row;
}
function addRatesToBody(list) {
  const rows = list.map(createRow);

  const table = document.createElement("table");

  rows.forEach(item => table.appendChild(item));

  document.body.appendChild(table);
}

function addAccountsToBody(list) {
  const walletsTable = document.querySelector(".wallets table");

  list.forEach((item, index) => {
    const icon =
      '<td class="cell-item icon">' +
      '<img class="crypto-img" src="images/' +
      getIcon(item.balance.currency) +
      ' " alt="">' +
      "</td>";

    const currencyName =
      '<td class="cell-item base-currency name-currency">' +
      getExtendedName(item.balance.currency) +
      "</td>";

    const balance =
      '<td class="cell-item balance">' +
      '<text class="base-currency">' +
      getExtendedName(item.balance.currency) +
      "</text>" +
      "<br>" +
      '<text class="native-currency">' +
      getSymbol(item.native_balance.currency) +
      " " +
      item.native_balance.amount +
      "</text>" +
      "</td>";

    walletsTable.innerHTML =
      walletsTable.innerHTML +
      '<tr class="table-row">' +
      icon +
      currencyName +
      balance +
      "</tr>";
  });
}

fetch("http://localhost:8080/rates")
  .then(parseAsJson)
  .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
  .then(parseAsJson)
  .then(addAccountsToBody);
