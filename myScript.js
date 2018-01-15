// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
  return response.json();
}

function addRatesToBody(list) {
  //   list.forEach(item => {
  //     const myDiv = document.createElement("div");
  //     myDiv.classList.add("rate-item");
  //
  //     const myP = document.createElement("p");
  //     var className = myP.setAttribute("class", name);
  //
  //     myP.textContent =
  //       item.data.base +
  //       " 1" +
  //       " : " +
  //       item.data.amount +
  //       " " +
  //       item.data.currency;
  //
  //     myDiv.appendChild(myP);
  //     document.querySelector(".rates").appendChild(myDiv);
  //
  //   });
  // }

  list.forEach(item => {
    const myTabRow = document.createElement("tr");
    const myNewCell = document.createElement("td");

    myNewCell.textContent = item.data.base;

    myNewCell.setAttribute("class", "cell-item currency base-currency");
    myTabRow.appendChild(myNewCell);
    document.querySelector("table").appendChild(myTabRow);
  });
}

function addAccountsToBody(list) {
  list.forEach(item => {
    const myDiv = document.createElement("div");
    myDiv.classList.add("wallet-item");

    const myP = document.createElement("p");
    myP.textContent =
      item.balance.amount +
      " " +
      item.balance.currency +
      " : " +
      item.native_balance.amount +
      " " +
      item.native_balance.currency;
    myDiv.appendChild(myP);
    document.querySelector(".wallets").appendChild(myDiv);
  });
}

fetch("http://localhost:8080/rates")
  .then(parseAsJson)
  .then(addRatesToBody);

fetch("http://localhost:8080/accounts")
  .then(parseAsJson)
  .then(addAccountsToBody);
