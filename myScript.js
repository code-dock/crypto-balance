// chrome.runtime.sendMessage("Cryptosaurus");

fetch("./credentials.json")
    .then(v => v.text())
    .then(console.log);
