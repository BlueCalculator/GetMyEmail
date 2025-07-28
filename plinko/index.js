const $ = (id) => document.getElementById(id);

const canvas = $("plinkoCanvas");
const purse = $("purse");
const bet = $("betAmount");
const half = $("half")
const double = $("double")
const betButton = $("placeBet")
const manual = $("manual")
const automatic = $("automatic")
const resentWins = $("resentWins");


canvas.width = window.innerWidth * 0.65; 
canvas.height = window.innerWidth * 0.65;

const ctx = canvas.getContext("2d");
const gravity = 0.05;
const friction = 0.99;
const pegs = [];
const balls = [];
const winHistory = [];
const pegRadius = 5;
const ballRadius = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const binWidth = 40;
const floorHeight = 30; // Define floor height here
const binMargin = 10; // how far up the bins are from bottom

let acceptingBets = true

// Initialize betAmount from input value on load
let betAmount = parseFloat(bet.value) || 0;

document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("purseAmount") === null) {
        // localStorage.clear();
        localStorage.setItem("purseAmount", 10);
    }
    purseAmount = localStorage.getItem("purseAmount");
    purse.innerHTML = purseAmount;
    console.log("purseAmount is:", purseAmount);
});


betButton.addEventListener("click", () => {
  if(acceptingBets == true){
    autoBall(false)
  }
  else{
    return
  }
})

half.addEventListener("click", () => {
  betAmount = betAmount / 2
  bet.value = betAmount
})

double.addEventListener("click", () => {
  betAmount = betAmount *2
  bet.value = betAmount
})

manual.addEventListener("click", () => {
  acceptingBets = true
  betButton.classList.remove("deactive")
  betButton.classList.add("betActive")
  manual.classList.remove("unactive")
  manual.classList.add("active")
  automatic.classList.remove("active")
  automatic.classList.add("unactive")
  autoBall(false)
})

automatic.addEventListener("click", () => {
  acceptingBets = false
  betButton.classList.add("deactive")
  betButton.classList.remove("betActive")
  manual.classList.remove("active")
  manual.classList.add("unactive")
  automatic.classList.remove("unactive")
  automatic.classList.add("active")
  autoBall(true)
})

bet.addEventListener("change", () => {
  betAmount = parseFloat(bet.value) || 0;
  console.log("Bet amount changed to:", betAmount);
  purseAmount = purse.innerHTML;
  if(betAmount > purseAmount){
    betButton.classList.add("deactive")
    betButton.classList.remove("betActive")
  }else{
    betButton.classList.remove("deactive")
    betButton.classList.add("betActive")
  }
});

// Helper to round to two decimals
function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const bins = [
  { x: 0 * binWidth, name: "10x",  color: "#440000", wiggleUntil: 0, wiggleStart: 0 },
  { x: 1 * binWidth, name: "5x",   color: "#661111", wiggleUntil: 0, wiggleStart: 0 },
  { x: 2 * binWidth, name: "3x",   color: "#882222", wiggleUntil: 0, wiggleStart: 0 },
  { x: 3 * binWidth, name: "1.5x", color: "#aa3333", wiggleUntil: 0, wiggleStart: 0 },
  { x: 4 * binWidth, name: "1x",   color: "#cc4444", wiggleUntil: 0, wiggleStart: 0 },
  { x: 5 * binWidth, name: "0.5x", color: "#ee5555", wiggleUntil: 0, wiggleStart: 0 },
  { x: 6 * binWidth, name: "0.2x", color: "#ff6969", wiggleUntil: 0, wiggleStart: 0 },  
  { x: 7 * binWidth, name: "0.5x", color: "#ee5555", wiggleUntil: 0, wiggleStart: 0 },
  { x: 8 * binWidth, name: "1x",   color: "#cc4444", wiggleUntil: 0, wiggleStart: 0 },
  { x: 9 * binWidth, name: "1.5x", color: "#aa3333", wiggleUntil: 0, wiggleStart: 0 },
  { x: 10 * binWidth, name: "3x",  color: "#882222", wiggleUntil: 0, wiggleStart: 0 },
  { x: 11 * binWidth, name: "5x",  color: "#661111", wiggleUntil: 0, wiggleStart: 0 },
  { x: 12 * binWidth, name: "10x", color: "#440000", wiggleUntil: 0, wiggleStart: 0 }   
];



// Create pegs in triangle shape
const totalRows = 12;
const spacing = 50;
const centerX = canvasWidth / 2;

for (let row = 1; row < totalRows; row++) {
  const pegsInRow = row + 1;
  const rowWidth = (pegsInRow - 1) * spacing;
  const offsetX = centerX - rowWidth / 2;
  const y = 10 + row * spacing;

  for (let col = 0; col < pegsInRow; col++) {
    const x = offsetX + col * spacing;
    pegs.push({ x, y });
  }
}

function spawnBall() {
  if (betAmount <= 0){
    return
  }
  // Prevent spawning if purse insufficient
  let currentPurse = parseFloat(purse.textContent);
  
  if (currentPurse < betAmount){
    alert("Too Poor for Bet Amount")
    return
  }else if(currentPurse == 0){
    localStorage.setItem("purseAmount", 10)
    alert('ur bad and out of points (refresh to play again)')
  };

  purseAmount = roundToTwo(currentPurse - betAmount);

  purse.textContent = purseAmount

  localStorage.setItem("purseAmount", purseAmount)

  balls.push({
    x: canvasWidth / 2 + (Math.random() - 0.5) * 50,
    y: 0,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
    landed: false,
  });
}

function update() {
  const now = performance.now();

  for (let i = balls.length - 1; i >= 0; i--) {
    const ball = balls[i];

    if (ball.landed) {
      // Remove ball 1 second after landing
        if (now - ball.landedTime > 10) {
          balls.splice(i, 1);
      }
      // Skip physics updates for landed balls
      continue;
    }

    // Apply gravity and friction
    ball.vy += gravity;
    ball.vx *= friction;
    ball.vy *= friction;

    // Wall collision (bounce left/right)
    if (ball.x < ballRadius) {
      ball.vx = Math.abs(ball.vx);
      ball.x = ballRadius;
    } else if (ball.x > canvasWidth - ballRadius) {
      ball.vx = -Math.abs(ball.vx);
      ball.x = canvasWidth - ballRadius;
    }

    // Peg collision with bias towards center
    for (let peg of pegs) {
      const dx = ball.x - peg.x;
      const dy = ball.y - peg.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < pegRadius + ballRadius) {
        const angle = Math.atan2(dy, dx);
        const targetX = peg.x + Math.cos(angle) * (pegRadius + ballRadius);
        const targetY = peg.y + Math.sin(angle) * (pegRadius + ballRadius);

        ball.vx += (targetX - ball.x) * 0.2;
        ball.vy += (targetY - ball.y) * 0.2;

        const biasStrength = 0.0035;
        const dxToCenter = centerX - ball.x;
        ball.vx += dxToCenter * biasStrength;
      }
    }

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor collision and scoring
    if (ball.y > canvasHeight - floorHeight - binMargin - ballRadius + 5) {
      ball.vy = 0;
      ball.vx = 0;
      ball.y = canvasHeight - ballRadius;

      if (!ball.landed) {
        ball.landed = true;
        ball.landedTime = now;

        // Calculate bins positions & check which bin ball landed in
        const binGap = 5;
        const totalBins = bins.length;
        const totalGaps = totalBins - 1;
        const totalWidth = totalBins * binWidth + totalGaps * binGap;
        const startX = (canvasWidth - totalWidth) / 2;

        for (let j = 0; j < bins.length; j++) {
          const binLeft = startX + j * (binWidth + binGap);
          const binRight = binLeft + binWidth;

          if (ball.x >= binLeft && ball.x < binRight) {
            console.log(`Ball landed in bin ${bins[j].name}`);

            let multAmount = parseFloat(bins[j].name.slice(0, -1)); // Remove trailing 'x'
            let newAmount = roundToTwo(betAmount * multAmount);

            let currentPurse = parseFloat(purse.textContent);
            purse.textContent = roundToTwo(currentPurse + newAmount);

            localStorage.setItem("purseAmount", purse.textContent)

            bins[j].wiggleStart = now;
            bins[j].wiggleUntil = now + 400; // wiggle for 400ms

            console.log("Winnings added:", newAmount);

            winHistory.unshift({ name: bins[j].name, color: bins[j].color });
            if (winHistory.length > 3) {
              winHistory.pop(); 
            }
        
            resentWins.innerHTML = "";
            for (const win of winHistory) {
              const entry = document.createElement("div");
              entry.textContent = win.name;
              entry.style.backgroundColor = win.color
              entry.className = "win-entry"; // optional style class
              resentWins.appendChild(entry);
            }

            break;
          }
        }
      }
    }
  }
}



function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Draw pegs
  ctx.fillStyle = "#fff";
  for (let peg of pegs) {
    ctx.beginPath();
    ctx.arc(peg.x, peg.y, pegRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  const binGap = 5; // adjust this for wider/narrower spacing
  const totalBins = bins.length;
  const totalGaps = totalBins - 1;
  const totalWidth = totalBins * binWidth + totalGaps * binGap;
  const startX = (canvasWidth - totalWidth) / 2;

  // Draw bins

  for (let i = 0; i < bins.length; i++) {
    const bin = bins[i];
    const x = startX + i * (binWidth + binGap);
  
    const now = performance.now();
    let yOffset = -1;
  
    if (bin.wiggleUntil > now) {
      const progress = (now - bin.wiggleStart) / (bin.wiggleUntil - bin.wiggleStart);
      const wiggleFreq = 1; // wiggles per second
      const wiggleAmp = 6;  // max pixels to move up/down
      yOffset = Math.sin(progress * wiggleFreq * 2 * Math.PI) * wiggleAmp;
    }
  
    ctx.fillStyle = bin.color;
    ctx.fillRect(x, canvasHeight - floorHeight - binMargin + yOffset, binWidth, floorHeight);
  
    ctx.fillStyle = shadeColor(bin.color, -40);
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bin.name, x + binWidth / 2, canvasHeight - floorHeight / 2 - binMargin + yOffset);
  }




  // Draw balls
  ctx.fillStyle = "#f44";
  for (let ball of balls) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Helper to darken colors by percent
function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16),
    t = percent < 0 ? 0 : 255,
    p = Math.abs(percent) / 100,
    R = f >> 16,
    G = (f >> 8) & 0x00ff,
    B = f & 0x0000ff;
  const newR = Math.round((t - R) * p) + R;
  const newG = Math.round((t - G) * p) + G;
  const newB = Math.round((t - B) * p) + B;
  return `rgb(${newR},${newG},${newB})`;
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

let autoInterval = null

function autoBall(auto) {
  if (auto === true) {
    if (!autoInterval) {
      autoInterval = setInterval(spawnBall, 1000);
    }
  } else {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
    spawnBall();
  }
}

loop();
