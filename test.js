// var noOfCryptos = 1;

//  accounts
const TABLE_ROWS = 4;
const TABLE_CELLS = 5;

const TABLE = document.createElement("table");
const TR = document.createElement("tr");
const TD = document.createElement("td");
const P = document.createElement("p");

var classArray = ["currency", "number", "icon"];

var contentArray = [
  item.balance.amount,
  "noOfCrypto",
  item.balance.currency,
  item.native_balance.amount,
  item.native_balance.currency
];
