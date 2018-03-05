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

// function createSubtitle(name) {
//   const row = document.createElement("tr");
//   const subtitle = document.createElement("td");
//   subtitle.innerHTML = name;
//   subtitle.classList.add("subtitle");
//   row.appendChild(subtitle);
// }

function createRatesRow(currency) {
  const row = document.createElement("tr");

  const colIcon = document.createElement("td");
  const icon = document.createElement("img");
  icon.classList.add("img");
  icon.setAttribute("src", "images/" + getIcon(currency.data.base));
  icon.setAttribute("alt", "");
  colIcon.appendChild(icon);
  row.appendChild(colIcon);

  const colName = document.createElement("td");
  colName.innerHTML = getExtendedName(currency.data.base);
  row.appendChild(colName);

  const colInput = document.createElement("td");
  const currencyInput = document.createElement("input");
  currencyInput.classList.add(currency.data.base + "input");
  currencyInput.setAttribute("type", "text");
  colInput.appendChild(currencyInput);
  row.appendChild(colInput);

  const colResult = document.createElement("td");
  const resultSpan = document.createElement("span");
  resultSpan.classList.add(currency.data.base + "result");
  colResult.appendChild(resultSpan);
  row.appendChild(colResult);

  currencyInput.addEventListener("input", event => {
    const inputValue = currencyInput.value;
    const parsedValue = parseFloat(currencyInput.value);

    function showResult() {
      if (isNaN(parsedValue)) {
        inputBox.style.borderColor = "red";
        resultBox.textContent = "Error";
      } else {
        inputBox.style.borderColor = "transparent";
        resultSpan.innerHTML = currencyInput.value * currency.rate;
      }
      console.log(isNaN(currencyInput.value));
    }
    showResult();
  });

  const inputBox = currencyInput;
  const resultBox = resultSpan;

  return row;
}

function createAccountsRow(currency) {
  const row = document.createElement("tr");

  const colIcon = document.createElement("td");
  const icon = document.createElement("img");
  icon.classList.add("img");
  icon.setAttribute("src", "images/" + getIcon(currency.balance.currency));
  icon.setAttribute("alt", "");
  colIcon.appendChild(icon);
  row.appendChild(colIcon);

  const colName = document.createElement("td");
  colName.innerHTML = getExtendedName(currency.balance.currency);
  row.appendChild(colName);
}

function addRatesToBody(list) {
  const row = document.createElement("tr");
  const subtitle = document.createElement("td");
  subtitle.classList.add("subtitle");
  subtitle.innerHTML = "Rates";
  row.appendChild(subtitle);

  const rows = list.map(createRatesRow);
  const table = document.createElement("table");
  table.appendChild(subtitle);
  rows.forEach(item => table.appendChild(item));
  document.body.appendChild(table);
}

function addAccountsToBody(list) {
  const row = document.createElement("tr");
  const subtitle = document.createElement("td");
  subtitle.classList.add("subtitle");
  subtitle.innerHTML = "Accounts";
  row.appendChild(subtitle);

  const rows = list.map(createAccountsRow);
  const table = document.createElement("table");
  table.appendChild(subtitle);
  rows.forEach(item => table.appendChild(item));
  document.body.appendChild(table);
}
//   const icon =
//     '<td class="cell-item icon">' +
//     '<img class="img" src="images/' +
//     getIcon(item.balance.currency) +
//     ' " alt="">' +
//     "</td>";
//
//   const currencyName =
//     '<td class="cell-item base-currency name-currency">' +
//     getExtendedName(item.balance.currency) +
//     "</td>";
//
//   const balance =
//     '<td class="cell-item balance">' +
//     '<text class="base-currency">' +
//     getExtendedName(item.balance.currency) +
//     "</text>" +
//     "<br>" +
//     '<text class="native-currency">' +
//     getSymbol(item.native_balance.currency) +
//     " " +
//     item.native_balance.amount +
//     "</text>" +
//     "</td>";
//
//   walletsTable.innerHTML =
//     walletsTable.innerHTML +
//     '<tr class="table-row">' +
//     icon +
//     currencyName +
//     balance +
//     "</tr>";
// });

fetch("http://localhost:8080/rates")
  .then(parseAsJson)
  .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
  .then(parseAsJson)
  .then(addAccountsToBody);
