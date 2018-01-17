// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
  return response.json();
}

function addRatesToBody(list) {
  list.forEach(item => {
    const ratesTable = document.querySelector(".rates table .table-row");

    // Here we are saying that the table's HTML content is
    // whatever is already there, plus this big string.
    // This means that we are adding content to the end of the table
    ratesTable.innerHTML =
      ratesTable.innerHTML +
      // A backtick like this one here ` means that we are starting a
      // string that will span through multiple lines.
      // Inside this strings, we can make reference to variables by
      // writing them like this ${variableName}
      `
                <td class="cell-item">${item.data.base}•</td>
                <td class="cell-item">£${item.data.amount}</td>
            `;
  });
}

function addAccountsToBody(list) {
  list.forEach(item => {
    const walletsTable = document.querySelector(".wallets table");
    const listLength = list.length;

    var currencyIcons = ["bch.png", "ltc.png", "eth.jpg", "btc.png"];
    var names = ["Bitcoin Cash", "Litecoin", "Etherium", "Bitcoin"];
    for (i = 0; i < listLength; i++) {
      walletsTable.innerHTML =
        walletsTable.innerHTML +
        `<tr class="table-row">
            <td class="cell-item icon">
              <img class="crypto-img" src="${currencyIcons[i]}" alt=""></td>
            <td class="cell-item base-currency name-currency">${names[i]}</td>

            <td class="cell-item balance">
              <text class="base-currency">${item.balance.amount} ${item.balance
          .currency}</text><br>
              <text class="native-currency">£${item.native_balance
                .amount}</text></td>
        </tr>`;
    }
  });
}

fetch("http://localhost:8080/rates")
  .then(parseAsJson)
  .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
  .then(parseAsJson)
  .then(addAccountsToBody);
