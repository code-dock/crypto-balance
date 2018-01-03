// chrome.runtime.sendMessage("Cryptosaurus");

function parseAsJson(response) {
    return response.json();
}

function addToBody(list) {
    list.forEach(item => {
        const info = item.data.base + ": " + item.data.amount;
        document.body.textContent = document.body.textContent + "<br>" + info;
    });
}

fetch("http://localhost:8080/rates")
    .then(parseAsJson)
    .then(addToBody);
