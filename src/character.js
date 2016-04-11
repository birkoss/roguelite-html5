
Character = function(game, x, y, tile) {
	Phaser.Sprite.call(this, game, x, y, tile);

this.scale = {x: game.scaleFactor, y: game.scaleFactor};

	this.x += (this.width/2);
	this.y += (this.height/2);


	this.anchor.setTo(0.5, 0.5);

	// this.scale.x *= -1;

	var hp = 1;
	var followTarget = false;
	var target;
	var aggroRange;
	var idleAnimation = false;
	var idlePeriod = 4000;
	var nextIdle = 0;  // AND THE REST

	this.direction = 'left';

}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;


Character.prototype.getPosition = function() {
	var x = (this.x ) / this.game.scaleFactor;
	var y = (this.y ) / this.game.scaleFactor;

	return {x: x, y: y};
}

Character.prototype.face = function(direction) {
	if( this.direction != direction ) {
		console.log("Facing: " + direction + " from " + this.direction);
		this.direction = direction;
		this.scale.x *= -1;
	}
}

Character.prototype.move = function(paths) {
	if( paths.length > 0 ) {
		var position = paths.shift();
		var origin = {x: (this.x - (Math.abs(this.width)/2)) / (32 * this.game.scaleFactor), y: (this.y - (Math.abs(this.height)/2))  / (32 * this.game.scaleFactor) };

		var destination = {x: this.x, y: this.y};

		console.log(origin);
		console.log(position);
		console.log("-----------------");
		if( origin.x != position.x ) {
			this.face( origin.x > position.x ? 'left' : 'right' );
			destination.x -= this.width;
		}
		if( origin.y != position.y ) {
			destination.y -= (this.height) * (origin.y - position.y);
		}

		var playerMovement = this.game.add.tween(this);

		var new_x = (position.x * 32 * this.game.scaleFactor);


		playerMovement.to(destination, 100);

		playerMovement.onComplete.add(function(){
			this.move(paths);
		}, this);

		playerMovement.start();
	} else {
		this.game.input.enabled = true;
	}
}
