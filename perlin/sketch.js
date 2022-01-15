function setup() {
  createCanvas(displayWidth, displayHeight);
  frameRate(60);
}

let time = 0;
let dt = 0.02;

let tileWidth = 15;
let tileHeight = 15;

function draw() {
  time += dt;
  background(255);
  for (let y = 0; y < displayHeight; y += tileHeight) {
    for (let x = 0; x < displayWidth; x += tileWidth) {
      let angle = noise(x / 150, y / 150, time) * 2 * PI;

      // drawing the vector field
      push();
      translate(x, y);
      rotate(angle);
      stroke(1, 35);
      line(0, 0, tileWidth, 0);
      pop();
    }
  }
}