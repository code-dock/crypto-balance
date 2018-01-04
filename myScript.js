// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
  return response.json();
}

// function drawClass(name, data) {
//   list.forEach(item => {
//     const myDiv = document.createElement("div");
//     const myP = document.createElement("p");
//
//     var className = myP.setAttribute("class", name);
//
//     myP.textContent = data;
//     myDiv.appendChild(myP);
//     document.querySelector(".rates").appendChild(myDiv);
//   });
// }

function addRatesToBody(list) {
  list.forEach(item => {
    const myDiv = document.createElement("div");
    myDiv.classList.add("rate-item");

    const myP = document.createElement("p");
    // var className = myP.setAttribute("class", name);
    // write a function to create and add a class to myP

    myP.textContent =
      item.data.base +
      " 1" +
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
