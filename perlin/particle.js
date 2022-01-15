function Particle() {
	this.position = createVector(random(displayWidth), random(displayHeight));
	this.prevPosition = this.position.copy();
	this.speed = createVector(0, 0);
	this.speed.limit(30);

	this.draw = function() {
		stroke(255, 1);
		line(this.prevPosition.x, this.prevPosition.y, this.position.x, this.position.y);
	}

	this.applyForce = function(angle, deltaT) {
		this.speed.add(p5.Vector.fromAngle(angle).mult(deltaT / 50));
		this.speed.limit(30);
	}

	this.move = function(deltaT) {
		this.prevPosition = this.position.copy();
		let dpos = p5.Vector.mult(this.speed, deltaT / 100);
		this.position.add(dpos);

		if (this.position.x < 0) {
			this.position.x = displayWidth;
			this.prevPosition = this.position.copy();
		} else if (this.position.y < 0) {
			this.position.x = displayHeight;
			this.prevPosition = this.position.copy();
		} else if (this.position.x > displayWidth) {
			this.position.x = 0;
			this.prevPosition = this.position.copy();
		} else if (this.position.y > displayHeight) {
			this.position.y = 0;
			this.prevPosition = this.position.copy();
		}

		// if (this.position.x < 0 || this.position.y < 0 || this.position.x > displayWidth || this.position.y > displayHeight) {
		// 	this.position = createVector(random(displayWidth), random(displayHeight));
		// 	this.prevPosition = this.position.copy();
		// 	this.speed = createVector(0, 0);
		// 	this.speed.limit(30);
		// }
	}
}