const wood = document.getElementById("wood");
const silver = document.getElementById("silver");
const diamond = document.getElementById("dimond");
const ouch = document.getElementById("ouch");
const purse = document.getElementById("purse");
const spiner = document.getElementById("spiner");
const body = document.getElementById("body");
const spinerWraper = document.getElementById("spinnerWrapper");
const whiteTriangle = document.getElementById("whiteTriangle");
const AddtoBag = document.getElementById("AddtoBag");
const Bag = document.getElementById("Bag");
let purseAmount = parseInt(localStorage.getItem("purseAmount")) || 10;
let selectedItems = [];
let bagItems = [];
let spinnerInnerUnorganized = [];

document.addEventListener("DOMContentLoaded", function () {
  localStorage.setItem("purseAmount", purseAmount);
  purse.innerHTML = purseAmount;

  const storedBag = localStorage.getItem("bagItems");
  if (storedBag) {
    try {
      bagItems = JSON.parse(storedBag);
      Bag.innerHTML = bagItems.map(i => i.html).join('');
    } catch {
      bagItems = [];
    }
  }

  whiteTriangle.style.display = "none";
  AddtoBag.style.display = "none";
});

const rarityOdds = {
  wood: { gray: 70, green: 20, blue: 8, purple: 2, gold: 0 },
  silver: { gray: 45, green: 30, blue: 15, purple: 8, gold: 2 },
  diamond: { gray: 20, green: 25, blue: 30, purple: 20, gold: 5 },
  mythic: { gray: 5, green: 15, blue: 25, purple: 35, gold: 20 }
};

const lootItems = [
  { name: "Black TI-30X IIS", img: "img/loot/blackCalculator.png", rarity: "gray" },
  { name: "Green TI-30X IIS", img: "img/loot/greenCalculator.png", rarity: "green" },
  { name: "Orange TI-30X IIS", img: "img/loot/orangeCalculator.png", rarity: "blue" },
  { name: "Purple TI-30X IIS", img: "img/loot/purpleCalculator.png", rarity: "purple" },
  { name: "Gray TI-30X IIS", img: "img/loot/grayCalculator.png", rarity: "gray" },
  { name: "Red TI-30X IIS", img: "img/loot/redCalculator.png", rarity: "green" },
  { name: "Pink TI-30X IIS", img: "img/loot/PinkyCalculator.png", rarity: "purple" },
  { name: "Bluest TI-30X IIS", img: "img/loot/bluestCalculatorest.png", rarity: "gold" }
];

function getRandomLootItem(rarityOdds) {
  const pool = [];
  for (const rarity in rarityOdds) {
    for (let i = 0; i < rarityOdds[rarity]; i++) pool.push(rarity);
  }
  const chosen = pool[Math.floor(Math.random() * pool.length)];
  const filtered = lootItems.filter(item => item.rarity === chosen);
  return filtered[Math.floor(Math.random() * filtered.length)];
}

function populateSpinner(items) {
  spinnerInnerUnorganized = items.map(item => `
    <div class="spinnerOutter">
      <div class="spinnerIteam ${item.rarity}"><img src="${item.img}"></div>
      <p>${item.name}</p>
    </div>`
  );
  spiner.innerHTML = spinnerInnerUnorganized.join('');
}

function animateSpinny() {
  const offset = (320 + 128) * 15 - (window.innerWidth / 2) + 160;
  const screenTop = window.innerHeight / 1.5;

  whiteTriangle.style.display = "block";
  spinerWraper.style.top = `-${screenTop}px`;
  spinerWraper.style.display = "block";
  body.style.display = "block";

  spiner.style.transition = "none";
  spiner.style.transform = "translateX(0)";
  void spiner.offsetWidth;

  spiner.style.transition = "transform 4s ease-in-out";
  spiner.style.transform = `translateX(-${offset}px)`;

  body.classList.remove("slideDown");
  void body.offsetWidth;
  body.classList.add("slideDown");

  setTimeout(() => AddtoBag.style.display = "block", 4000);
}

function undoSpinny() {
  const item = selectedItems[15];
  const sellValues = { gray: 5, green: 10, blue: 25, purple: 50, gold: 100 };
  const sellvalue = sellValues[item.rarity];
  const id = Date.now() + Math.random();

  const html = `
    <div class="bagItem ${item.rarity}" data-id="${id}">
      <img src="${item.img}">
      <p>Sell for ${sellvalue}p</p>
    </div>`;

  bagItems.push({ id, html });
  Bag.innerHTML = bagItems.map(i => i.html).join('');
  localStorage.setItem("bagItems", JSON.stringify(bagItems));

  AddtoBag.style.display = "none";
  whiteTriangle.style.display = "none";
  spinerWraper.style.display = "none";
  body.style.display = "none";
  body.classList.remove("slideDown");
}

Bag.addEventListener("mouseover", e => {
  const item = e.target.closest(".bagItem");
  if (item) item.querySelector("p").style.display = 'block';
});

Bag.addEventListener("mouseout", e => {
  const item = e.target.closest(".bagItem");
  if (item) item.querySelector("p").style.display = 'none';
});

Bag.addEventListener("click", e => {
  const item = e.target.closest(".bagItem");
  if (!item) return;

  const p = item.querySelector("p");
  const match = p?.textContent.match(/Sell for (\d+)p/);
  const idToRemove = item.dataset.id;

  if (match && idToRemove) {
    const value = parseInt(match[1]);
    purseAmount += value;
    purse.innerHTML = purseAmount;
    localStorage.setItem("purseAmount", purseAmount);

    const index = bagItems.findIndex(bagItem => String(bagItem.id) === idToRemove);

    console.log("id", idToRemove);
    console.log("bagItems index", index);

    if (index !== -1) {
      bagItems.splice(index, 1);
      localStorage.setItem("bagItems", JSON.stringify(bagItems));
      item.remove();
    } else {
      console.warn("ID not found in bagItems, no removal.");
    }
  } else {
    alert("Major error: Sell value or ID missing.");
  }
});



function resetSpinner() {
  selectedItems = [];
  spiner.innerHTML = "";
  body.classList.remove("slideDown");
}

function handleClick(boxType) {
  console.log(`${boxType} box clicked`);

  const removeMOney = { wood: 15, silver: 25, diamond: 50, mythic: 100};
  const removeMONEYs = removeMOney[boxType];
  console.log("IT cost liek this much pelase and thank you:", removeMONEYs)
  if(purseAmount < removeMONEYs){
    alert("HEY! you can't aford this hahaha")
  }else if(purseAmount == 0){
    alert("Refresh to get more monies ;)")
  }else{
    purseAmount -= removeMONEYs;
    purse.innerHTML = purseAmount;
    localStorage.setItem("purseAmount", purseAmount);
    resetSpinner();
    for (let i = 0; i < 30; i++) {
      selectedItems.push(getRandomLootItem(rarityOdds[boxType]));
    }
    populateSpinner(selectedItems);
    setTimeout(animateSpinny, 500);
  }
  
}

wood.addEventListener("click", () => handleClick("wood"));
silver.addEventListener("click", () => handleClick("silver"));
diamond.addEventListener("click", () => handleClick("diamond"));
ouch.addEventListener("click", () => handleClick("mythic"));

const BuyEmail = document.getElementById("BuyEmail")

function BuyBuyBuy(){
    if(purseAmount < 100){
        alert("Not Enough Maybe Try Harder!")
    }else if(purseAmount >= 100){
        alert("Congrates! my Email is: bluestcalculatorest@gmail.com")
        purseAmount -= 100 
        localStorage.setItem("purseAmount", purseAmount)
        purse.innerHTML = purseAmount
    }
}

BuyEmail.addEventListener('click', BuyBuyBuy);

