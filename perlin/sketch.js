let time = 0;
let dt = 0.02;

let tileWidth = 60;
let tileHeight = 60;

let particlesN = 2500;
let particles = [];



function setup() {
  createCanvas(displayWidth, displayHeight);
  frameRate(60);
  background(0);
  for (let i = 0; i < particlesN; ++i) {
    particles.push(new Particle());
  }
}

function draw() {
  time += deltaTime;
  // background(0);
  for (let i = 0; i < particles.length; ++i) {
    let angle = noise(particles[i].position.x / 170, particles[i].position.y / 170, time / 10000) * 2 * PI;
    particles[i].applyForce(angle, deltaTime);
    particles[i].move(deltaTime);
    particles[i].draw();
  }
  // for (let y = 0; y < displayHeight; y += tileHeight) {
  //   for (let x = 0; x < displayWidth; x += tileWidth) {
  //     let angle = noise(x / 170, y / 170, time / 10000) * 2 * PI;

  //     // drawing the vector field
  //     stroke(120, 35);
  //     strokeWeight(1);
  //     line(x, y, x + tileWidth * sin(angle), y + tileWidth * cos(angle));
  //   }
  // }

  // text((frameRate() | 0), 0, 10);
}