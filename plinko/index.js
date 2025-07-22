const canvas = document.getElementById("plinkoCanvas");
const purse = document.getElementById("purse");
const bet = document.getElementById("betAmount");

const ctx = canvas.getContext("2d");
const GRAVITY = 0.05;
const FRICTION = 0.99;
const pegs = [];
const balls = [];
const pegRadius = 5;
const ballRadius = 10;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;
const BIN_COUNT = 17;
const BIN_WIDTH = 50;
const floorHeight = 30; // Define floor height here

let purseAmount = 10;
purse.textContent = purseAmount;

// Initialize betAmount from input value on load
let betAmount = parseFloat(bet.value) || 0;

bet.addEventListener("change", () => {
  betAmount = parseFloat(bet.value) || 0;
  console.log("Bet amount changed to:", betAmount);
});

// Helper to round to two decimals
function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

const bins = [
  { x: 0 * BIN_WIDTH, name: "110x", color: "#ff4444" },
  { x: 1 * BIN_WIDTH, name: "41x", color: "#44ff44" },
  { x: 2 * BIN_WIDTH, name: "10x", color: "#4444ff" },
  { x: 3 * BIN_WIDTH, name: "5x", color: "#ffff44" },
  { x: 4 * BIN_WIDTH, name: "3x", color: "#ff44ff" },
  { x: 5 * BIN_WIDTH, name: "1.5x", color: "#44ffff" },
  { x: 6 * BIN_WIDTH, name: "1x", color: "#ff9944" },
  { x: 7 * BIN_WIDTH, name: "0.5x", color: "#99ff44" },
  { x: 8 * BIN_WIDTH, name: "0.3x", color: "#4499ff" },
  { x: 9 * BIN_WIDTH, name: "0.5x", color: "#ff4499" },
  { x: 10 * BIN_WIDTH, name: "1x", color: "#44ff99" },
  { x: 11 * BIN_WIDTH, name: "1.5x", color: "#9944ff" },
  { x: 12 * BIN_WIDTH, name: "3x", color: "#ff6699" },
  { x: 13 * BIN_WIDTH, name: "5x", color: "#66ff99" },
  { x: 14 * BIN_WIDTH, name: "10x", color: "#9966ff" },
  { x: 15 * BIN_WIDTH, name: "41x", color: "#ff9966" },
  { x: 16 * BIN_WIDTH, name: "110x", color: "#66ff66" },
  { x: 17 * BIN_WIDTH, name: "", color: "#6666ff" }, // Right edge wall only
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
  // Prevent spawning if bet is zero or purse insufficient
  if (betAmount <= 0) return;

  let currentPurse = parseFloat(purse.textContent);
  if (currentPurse < betAmount) return;

  purse.textContent = roundToTwo(currentPurse - betAmount);

  balls.push({
    x: canvasWidth / 2 + (Math.random() - 0.5) * 50,
    y: 0,
    vx: (Math.random() - 0.5) * 2,
    vy: 0,
    landed: false,
  });
}

function update() {
  for (let ball of balls) {
    ball.vy += GRAVITY;
    ball.vx *= FRICTION;
    ball.vy *= FRICTION;

    // Wall collision
    if (ball.x < ballRadius || ball.x > canvasWidth - ballRadius) {
      ball.vx *= -1;
      ball.x = Math.max(ballRadius, Math.min(canvasWidth - ballRadius, ball.x));
    }

    // Peg collision with center bias
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

        const biasStrength = 0.006;
        const dxToCenter = centerX - ball.x;
        ball.vx += dxToCenter * biasStrength;
      }
    }

    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Floor collision and scoring
    if (ball.y > canvasHeight - ballRadius) {
      ball.vy = 0;
      ball.vx = 0;
      ball.y = canvasHeight - ballRadius;

      if (!ball.landed) {
        ball.landed = true;

        for (let i = 0; i < bins.length - 1; i++) {
          const binLeft = bins[i].x;
          const binRight = bins[i + 1].x;

          if (ball.x >= binLeft && ball.x < binRight) {
            console.log(`Ball landed in bin ${bins[i].name}`);

            let multAmount = parseFloat(bins[i].name.slice(0, -1)); // Remove trailing 'x'
            let newAmount = roundToTwo(betAmount * multAmount);

            let currentPurse = parseFloat(purse.textContent);
            purse.textContent = roundToTwo(currentPurse + newAmount);

            console.log("Winnings added:", newAmount);
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

  // Draw bins
  for (let i = 0; i < bins.length - 1; i++) {
    const bin = bins[i];
    ctx.fillStyle = bin.color;
    ctx.fillRect(bin.x, canvasHeight - floorHeight, BIN_WIDTH, floorHeight);

    ctx.fillStyle = shadeColor(bin.color, -40);
    ctx.font = "16px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(bin.name, bin.x + BIN_WIDTH / 2, canvasHeight - floorHeight / 2);
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

setInterval(spawnBall, 1000);
loop();
