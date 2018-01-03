// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
    return response.json();
}

function addToBody(list) {
    list.forEach(item => {
        const myDiv = document.createElement("div");
        myDiv.classList.add("wallet-item");

        const myP = document.createElement("p");

        myP.textContent = item.name;
        myDiv.appendChild(myP);
        document.querySelector(".wallets").appendChild(myDiv);
    });
}

fetch("http://localhost:8080/accounts")
    .then(parseAsJson)
    .then(addToBody);
