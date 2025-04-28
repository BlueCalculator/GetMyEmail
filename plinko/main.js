const ball = document.getElementById('ball');
const pegsContainer = document.getElementById('pegs');
const bins = document.getElementsByClassName('bin');
let pegs = [];
let ballY = 0, ballX = 150, ballSpeedY = 0, ballSpeedX = 0;
let isGameActive = false;
const boardWidth = 300;
const boardHeight = 500;

function createPegs() {
    pegsContainer.innerHTML = '';
    pegs = [];
  
    const rows = 6; // Number of rows in the grid
    const cols = 6; // Number of columns in the grid
    const pegSpacing = 70; // Spacing between pegs
    const offsetSpacing = pegSpacing / 2; // Adjust this value for the amount of offset between alternate rows
  
    for (let row = 0; row < rows; row++) {
      // Alternate offset for odd rows
      const rowOffsetX = (row % 2 === 0) ? 0 : offsetSpacing;
  
      for (let col = 0; col < cols; col++) {
        const xPos = col * pegSpacing + rowOffsetX; // Apply the offset to alternate rows
        const yPos = row * pegSpacing; // Y position for the peg
  
        const peg = document.createElement('div');
        peg.classList.add('peg');
        peg.style.left = `${xPos}px`;
        peg.style.top = `${yPos}px`;
        pegs.push({ element: peg, x: xPos, y: yPos });
        pegsContainer.appendChild(peg);
      }
    }
  }
  

function dropBall() {
  if (isGameActive) return;

  let pinkAngle = Math.floor(Math.random() * 180) + 1;
    
  isGameActive = true;
  ballY = 0;
  ballX = 150;
  ballSpeedY = 1;
  ballSpeedX = Math.cos(Math.PI * pinkAngle / 180) * 2;

  const interval = setInterval(() => {
    ballY += ballSpeedY;
    ballSpeedY += 0.1; 
    ballX += ballSpeedX;
    ballSpeedX *= 0.99; 
    ball.style.top = `${ballY}px`;
    ball.style.left = `${ballX}px`;

   
    if (ballX <= 0 || ballX >= boardWidth - 15) { 
      ballSpeedX *= -1; 
      ballX = Math.max(0, Math.min(ballX, boardWidth - 15)); 
    }

    if (ballY >= boardHeight - 15) { 
      ballSpeedY *= -0.7; 
      ballY = boardHeight - 15;
    }

    pegs.forEach(peg => {
      if (Math.abs(ballX - peg.x) < 10 && Math.abs(ballY - peg.y) < 10) {
        ballSpeedY *= -0.7; 
        ballSpeedX += (ballX - peg.x) * 0.1; 
      }
    });

    if (ballY >= boardHeight - 15) {
      clearInterval(interval);
      placeInBin();
    }
  }, 16);
}

function placeInBin() {
    const binWidth = boardWidth / bins.length;
    const binIndex = Math.floor(ballX / binWidth);
    // if (bins[binIndex].textContent.includes("yes")) {
    //     console.log("FJKDSLFJKL:SJSKLDFJSLJDFLKSDJFKLSDJFKLSJDKLFJKL:SDF");
    // } 
    const binText = bins[binIndex].textContent;
    if(binText === "Yes"){
        winner()
    }
    if(binText === "No"){
        loser()
    }
    bins[binIndex].style.backgroundColor = 'rgba(173, 216, 230, 0.596)';
    setTimeout(() => {
      Array.from(bins).forEach(bin => bin.style.backgroundColor = 'transparent');
    }, 1000);
    isGameActive = false;
  }
  
  const weiner = document.getElementById("weiner")
  const winnerAudio = new Audio("wow.mp3")
  function winner() {
    pauseResetAudio(zeldaAudio)
    winnerAudio.play()
    weiner.style.opacity = "100%"
  }

  const losera = document.getElementById("loser")
  const loserAudio = new Audio("sad.mp3")
    function loser(){
        pauseResetAudio(zeldaAudio)
        loserAudio.play()
        losera.style.opacity = "100%"
}

function pauseResetAudio(sound){
  sound.pause()
  sound.currentTime = 0
} 


// createPegs();
// if (!isGameActive) {
//     createPegs();
//     ball.style.top = '0';
//     ball.style.left = '150px';
//     dropBall(); 
//   }

  const plinko = document.getElementById("plinko-Game")
  const noBox = document.getElementById("noBox")
  const yesBox = document.getElementById("yesBox")
  const noCheck = document.getElementById("noCheck")
  const yesCheck = document.getElementById("yesCheck")
  const submit = document.getElementById("submit")
  const head = document.getElementById("head")
  const zeldaAudio = new Audio("zelda.mp3")
  var yesSelected = null

    noBox.addEventListener('mouseover', () => {
        if(yesSelected == false){
            null
        }else{
            noCheck.style.opacity = "20%"
        }
    });
    noBox.addEventListener('mouseout', () => {
        if(yesSelected == false){
            null
        }else{
            noCheck.style.opacity = "0"
        }
    });
    noBox.addEventListener('click', () => {
        yesCheck.style.opacity = "0"
        noCheck.style.opacity = "100%"
        yesSelected = false
    })
    yesBox.addEventListener('mouseover', () => {
        if(yesSelected == true){
            null
        }else{
            yesCheck.style.opacity = "20%"
        }
      });
    yesBox.addEventListener('mouseout', () => {
        if(yesSelected == true){
            null
        }else{
            yesCheck.style.opacity = "0"
        }
    });
    yesBox.addEventListener('click', () => {
        yesCheck.style.opacity = "100%"
        noCheck.style.opacity = "0"
        yesSelected = true
    })

    submit.addEventListener('click', () =>{
        if(yesSelected === null){
            alert("Pick Something")
        }else{
            zeldaAudio.play()
            head.style.display = "none"
            plinko.style.display = "block"
            if (!isGameActive) {
                createPegs();
                ball.style.top = '0';
                ball.style.left = '150px';
                dropBall(); 
            }
        }
    })

    


    function reset() {
        losera.style.opacity = "0"
        weiner.style.opacity = "0"
        yesSelected = null
        yesCheck.style.opacity = "0"
        noCheck.style.opacity = "0"
        head.style.display = "block"
        plinko.style.display = "none"
        head.style.display = "flex"
        head.style.justifyContent = "center"

    }
  
