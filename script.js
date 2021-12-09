const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

const comptuerX = innerWidth;
const computerY = innerHeight;

canvas.width = comptuerX;
canvas.height = computerY;

const mouse = {
  x: comptuerX / 2,
  y: computerY / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FF7F66"];

addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

addEventListener("resize", (e) => {
  canvas.width = comptuerX;
  canvas.height = computerY;
  initialize();
});

function randomIntFromRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
  return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
  const xDist = x2 - x1;
  const yDist = y2 - y1;
  return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function Star(x, y, radius, color) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.color = color;
  this.velocity = {
    x: randomIntFromRange(-7, 7),
    y: 3,
  };
  this.gravity = 0.4;
  this.friction = 0.8;
}

Star.prototype.draw = function () {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  c.fillStyle = this.color;
  c.shadowColor = "#E3EAEF";
  c.shadowBlur = 20;
  c.fill();
  c.closePath();
  c.restore();
};

Star.prototype.update = function () {
  this.draw();
  if (this.y + this.radius + this.velocity.y > computerY - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
    this.shatter();
  } else {
    // this.gravity -= 0.2;
    this.velocity.y += this.gravity;
  }
  if (
    this.x + this.radius + this.velocity.x > comptuerX ||
    this.x - this.radius < 0
  ) {
    this.velocity.x = -this.velocity.x * this.friction;
    this.shatter();
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
};

Star.prototype.shatter = function () {
  this.radius -= 3;
  for (let i = 0; i < 8; i++) {
    miniStars.push(new MiniStar(this.x, this.y, 2));
  }
};

function MiniStar(x, y, radius) {
  Star.call(this, x, y, radius);
  this.velocity = {
    x: randomIntFromRange(-5, 5),
    y: randomIntFromRange(-15, 15),
  };
  this.gravity = 0.1;
  this.friction = 0.8;
  this.ttl = 100;
  this.opacity = 1;
}

MiniStar.prototype.draw = function () {
  c.save();
  c.beginPath();
  c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  c.fillStyle = `rgba(227,234,239,${this.opacity})`;
  c.shadowColor = "#E3EAEF";
  c.shadowBlur = 17;
  c.fill();
  c.closePath();
  c.restore();
};

MiniStar.prototype.update = function () {
  this.draw();
  if (this.y + this.radius + this.velocity.y > computerY - groundHeight) {
    this.velocity.y = -this.velocity.y * this.friction;
  } else {
    this.velocity.y += this.gravity;
  }
  this.x += this.velocity.x;
  this.y += this.velocity.y;
  this.ttl -= 1;
  this.opacity -= 1 / this.ttl;
};

function createMountainRange(mountainAmount, height, color) {
  for (let i = 0; i < mountainAmount; i++) {
    const mountainWidth = comptuerX / mountainAmount;
    c.beginPath();
    c.moveTo(i * mountainWidth, computerY);
    c.lineTo(i * mountainWidth + mountainWidth + 500, computerY);
    c.lineTo(i * mountainWidth + mountainWidth / 2, computerY - height);
    c.lineTo(i * mountainWidth - 500, computerY);
    c.fillStyle = color;
    c.fill();
    c.closePath();
  }
}

const backgroundGradient = c.createLinearGradient(0, 0, 0, computerY);
backgroundGradient.addColorStop(0, "#171E26");
backgroundGradient.addColorStop(1, "#3F586B");

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
let groundHeight = 100;

function initialize() {
  stars = [];
  miniStars = [];
  backgroundStars = [];
  //   for (let i = 0; i < 1; i++) {
  //     const x = randomIntFromRange(30, comptuerX - 30);
  //     const y = randomIntFromRange(30, computerY - 30);
  //     const radius = 30;
  //     stars.push(new Star(x, y, radius, "#E3EAEF"));
  //   }
  for (let i = 0; i < 150; i++) {
    const x = randomIntFromRange(0, comptuerX);
    const y = randomIntFromRange(0, computerY);
    const radius = randomIntFromRange(0, 3);
    backgroundStars.push(new Star(x, y, radius, "white"));
  }
}

function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = backgroundGradient;
  c.fillRect(0, 0, canvas.width, canvas.height);

  backgroundStars.forEach((backgroundStar) => {
    backgroundStar.draw();
  });

  createMountainRange(1, computerY - 50, "#384551");
  createMountainRange(2, computerY - 100, "#2B3843");
  createMountainRange(3, computerY - 300, "#26333E");

  c.fillStyle = "#182028";
  c.fillRect(0, computerY - groundHeight, comptuerX, groundHeight);

  stars.forEach((star, index) => {
    star.update();
    if (star.radius <= 0) {
      stars.splice(index, 1);
    }
  });

  miniStars.forEach((miniStar, index) => {
    miniStar.update();
    if (miniStar.ttl <= 0) {
      miniStars.splice(index, 1);
    }
  });

  ticker++;
  if (ticker % randomSpawnRate == 0) {
    const radius = 12;
    const x = Math.max(radius, randomIntFromRange(0, comptuerX) - radius);
    stars.push(new Star(x, -100, radius, "#E3EAEF"));
    randomSpawnRate = randomIntFromRange(75, 200);
  }
}

initialize();
animate();
