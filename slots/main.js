const slotIteams = [
    "<div class='slotIteam'>🍒</div>", "<div class='slotIteam'>🍒</div>", "<div class='slotIteam'>🍒</div>", "<div class='slotIteam'>🍒</div>",
    "<div class='slotIteam'>🍋</div>", "<div class='slotIteam'>🍋</div>", "<div class='slotIteam'>🍋</div>",
    "<div class='slotIteam'>🍑</div>", "<div class='slotIteam'>🍑</div>",
    "<div class='slotIteam'>🍀</div>", "<div class='slotIteam'>🍀</div>",
    "<div class='slotIteam'>🔔</div>",
    "<div class='slotIteam'>💎</div>"
]

const slot1 = document.getElementById("1")
const slot2 = document.getElementById("2")
const slot3 = document.getElementById("3")
let purse = document.getElementById("purse")
let purseAmount = 10;
purse.innerHTML = purseAmount;

const playButton = document.getElementById('playButton');

  function handleButtonClick() {
    if(purseAmount > 0){
        playButton.disabled = true;
        purseAmount -= 1
        purse.innerHTML = purseAmount
        play()
        setTimeout(() => {
          playButton.disabled = false;
        }, 7000); 
    }else{
        alert('ur bad and out of points (refresh to play again)')
    }
  }

playButton.addEventListener('click', handleButtonClick);

function play() {
    slot1inner = getSlotIteams(slotIteams)
    slot1.innerHTML = slot1inner.join('')
    slot2inner = getSlotIteams(slotIteams)
    slot2.innerHTML = slot2inner.join('')
    slot3inner = getSlotIteams(slotIteams)
    slot3.innerHTML = slot3inner.join('')


    slot1.style.animation = "none"
    slot2.style.animation = "none"
    slot3.style.animation = "none"
    slot1.offsetHeight;
    slot2.offsetHeight;
    slot3.offsetHeight;
    slot1.style.animation = "spin 5s ease-in-out forwards"
    slot2.style.animation = "spin 6s ease-in-out forwards"
    slot3.style.animation = "spin 7s ease-in-out forwards"


    let whatyougot = []
    whatyougot.push(slot1inner[slot1inner.length - 1])
    whatyougot.push(slot2inner[slot2inner.length - 1])
    whatyougot.push(slot3inner[slot3inner.length - 1])
    console.log(whatyougot)
    
    let fruit = 0
    let bell = 0
    let clover = 0
    let dimond = 0

    fruit = 0
    bell = 0
    clover = 0
    dimond = 0

    whatyougot.forEach(element => {
        if(element === "<div class='slotIteam'>🍒</div>" || element === "<div class='slotIteam'>🍋</div>" || element === "<div class='slotIteam'>🍑</div>"){
            fruit += 1;
        }else if(element === "<div class='slotIteam'>🔔</div>"){
            bell += 1;
        }else if(element === "<div class='slotIteam'>🍀</div>"){
            clover += 1;
        }else if(element === "<div class='slotIteam'>💎</div>"){
            dimond += 1;
        }
    });
    
    setTimeout(() => {
        gameBrain(fruit, bell, clover, dimond)
    }, 7000);
}


function gameBrain(fruit, bell, clover, dimond){
    console.log(fruit,bell,clover, dimond)
    if(fruit === 3){
        purseAmount += 10
    }else if(bell === 3){
        purseAmount += 50 
    }else if(clover === 3){
        purseAmount += 30
    }else if(dimond === 3){
        purseAmount += 100
    }
    purse.innerHTML = purseAmount;
    fruit = 0
    bell = 0
    clover = 0
    dimond = 0
}


function getSlotIteams(list){
    return array = Array.from({ length: 30 }, () => 
        list[Math.floor(Math.random() * list.length)]);
}


const BuyEmail = document.getElementById("BuyEmail")

function BuyBuyBuy(){
    if(purseAmount < 100){
        alert("Not Enough Maybe Try Harder!")
    }else{
        alert("Congrates! my Email is: bluestcalculatorest@gmail.com")
        purseAmount -= 100 
        purse.innerHTML = purseAmount
    }
}

BuyEmail.addEventListener('click', BuyBuyBuy);
