// chrome.runtime.sendMessage("Cryptosaurus");
fetch("http://localhost:8080/rates")
    .then(function(response) {
        return response.json();
    })
    .then(function(jsonResponse) {
        const aString = JSON.stringify(jsonResponse);

        document.querySelector("body").textContent = aString;
    });
