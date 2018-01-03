// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
  return response.json();
}

function addRatesToBody(list) {
  list.forEach(item => {
    const myDiv = document.createElement("div");
    myDiv.classList.add("rate-item");

    const myP = document.createElement("p");

    myP.textContent =
      "1 " +
      item.data.base +
      " : " +
      item.data.amount +
      " " +
      item.data.currency;
    myDiv.appendChild(myP);
    document.querySelector(".rates").appendChild(myDiv);
  });
}

function addAccountsToBody(list) {
  list.forEach(item => {
    const myDiv = document.createElement("div");
    myDiv.classList.add("wallet-item");

    const myP = document.createElement("p");

    myP.textContent = item.name;
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
