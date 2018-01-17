// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
  return response.json();
}

function addRatesToBody(list) {
  list.forEach(item => {
    const ratesTable = document.querySelector(".rates table");

    // Here we are saying that the table's HTML content is
    // whatever is already there, plus this big string.
    // This means that we are adding content to the end of the table
    ratesTable.innerHTML =
      ratesTable.innerHTML +
      // A backtick like this one here ` means that we are starting a
      // string that will span through multiple lines.
      // Inside this strings, we can make reference to variables by
      // writing them like this ${variableName}
      `<tr class="table-row">
                <td class="cell-item currency base-currency">${item.data
                  .base}</td>
                <td class="cell-item adjust-number add-border">1</td>
                <td class="cell-item icon"> ↔ </td>
                <td class="cell-item fixed-number">${item.data.amount}</td>
                <td class="cell-item currency native-currency">${item.data
                  .currency}</td>
            </tr>`;
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
            <td class="cell-item">${names[i]}</td>

            <td class="cell-item balance">
              ${item.balance.amount}
              <br> £${item.native_balance.amount}</td>
            <td class="cell-item"> ↔ </td>
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
