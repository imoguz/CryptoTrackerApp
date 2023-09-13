// fetched the data
let coindata;
const options = {
  headers: {
    "x-access-token":
      "coinrankingfa0b5296f802d37c436acaa77fa97cbc71638d2a04171d56",
  },
};
const getCoins = async () => {
  try {
    const response = await fetch(
      "https://api.coinranking.com/v2/coins",
      options
    );
    if (!response.ok) {
      throw new Error("API error", response.status);
    }
    const { data } = await response.json();
    coindata = data;
  } catch (error) {
    form.reset();
    modalMessage.textContent = "API error, the coins data can not be fetched";
    modal.show();
    return;
  }
};
getCoins();

const displaySingleCoin = () => {
  coindata.coins.forEach((item) => {
    if (
      item.name.toLowerCase() == inputBox.value.toLowerCase() ||
      item.symbol.toLowerCase() == inputBox.value.toLowerCase()
    ) {
      if (allcoins == true) {
        container.innerHTML = "";
        coinList.splice(0, coinList.length);
        allcoins = false;
      }
      if (!coinList.includes(inputBox.value.toLowerCase())) {
        searchResult = 1;
        displayCoinCart(item);
      }
    }
  });
  if (!searchResult) {
    modalMessage.textContent = coinList.includes(inputBox.value.toLowerCase())
      ? "The coin name you have entered has already been displayed!"
      : "The coin name you have entered can not be found!";
    modal.show();
  }
  form.reset();
};
const displayAllCoins = () => {
  allcoins = true;
  coindata.coins.forEach((item) => {
    displayCoinCart(item);
  });
};
// selector
const form = document.getElementById("form");
const resetButton = document.getElementById("resetBtn");
const allButton = document.getElementById("allBtn");
const inputButton = document.getElementById("inputButton");
const inputBox = document.querySelector("#inputBox");
const container = document.querySelector("#container");
const modalMessage = document.querySelector("#modalMessage");
// variables
const coinList = [];
let searchResult = 0;
let allcoins;
let modal = new bootstrap.Modal(document.getElementById("modal"), {});
// eventlistener
form.addEventListener("submit", (event) => {
  event.preventDefault();
  getCoins();
  displaySingleCoin();
  searchResult = 0;
});
allButton.addEventListener("click", (event) => {
  allcoins = true;
  getCoins();
  displayAllCoins();
});
resetButton.addEventListener("click", () => {
  location.reload();
  getCoins();
});
container.addEventListener("click", (event) => {
  if (event.target.tagName == "I") {
    let coinName = event.target.previousElementSibling.innerHTML;
    coinName = coinName.slice(0, coinName.indexOf("<"));
    coinList.splice(coinList.indexOf(coinName), 1);
    let coinSymbol = event.target.previousElementSibling.lastChild.innerHTML;
    coinList.splice(coinList.indexOf(coinSymbol), 1);
    event.target.parentElement.parentElement.remove();
  }
});
// function
function displayCoinCart({ name, price, iconUrl, symbol, change }) {
  const divBox = document.createElement("div");
  const divName = document.createElement("div");
  const nameTag = document.createElement("p");
  const nameNode = document.createTextNode(name);
  nameTag.appendChild(nameNode);
  const symbolTag = document.createElement("sup");
  const symbolNode = document.createTextNode(symbol);
  symbolTag.appendChild(symbolNode);
  nameTag.appendChild(symbolTag);
  const iTag = document.createElement("i");
  iTag.setAttribute("class", "fa-sharp fa-regular fa-circle-xmark");
  const priceTag = document.createElement("h4");
  const priceNode = document.createTextNode("$" + Number(price).toFixed(6));
  priceTag.appendChild(priceNode);
  const imageTag = document.createElement("img");
  imageTag.setAttribute("src", iconUrl);
  const changeTag = document.createElement("p");
  change < 0
    ? changeTag.setAttribute("class", "text-danger")
    : changeTag.setAttribute("class", "text-success");
  const changeIcon = document.createElement("span");
  change < 0
    ? changeIcon.setAttribute("class", "fa-solid fa-arrow-trend-down")
    : changeIcon.setAttribute("class", "fa-solid fa-arrow-trend-up");
  const changeNode = document.createTextNode(" " + change);
  changeTag.appendChild(changeIcon);
  changeTag.appendChild(changeNode);
  divName.appendChild(nameTag);
  divName.appendChild(iTag);
  divBox.appendChild(divName);
  divBox.appendChild(priceTag);
  divBox.appendChild(imageTag);
  divBox.appendChild(changeTag);
  container.prepend(divBox);
  coinList.push(name.toLowerCase());
  coinList.push(symbol.toLowerCase());
}
