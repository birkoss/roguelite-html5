
Character = function(game, x, y, tile) {
	Phaser.Sprite.call(this, game, x, y, tile);

	var hp = 1;
	var followTarget = false;
	var target;
	var aggroRange;
	var idleAnimation = false;
	var idlePeriod = 4000;
	var nextIdle = 0;  // AND THE REST
	this.scale = {x: game.scaleFactor, y: game.scaleFactor};
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

Character.prototype.move = function(paths) {
	if( paths.length > 0 ) {
		var position = paths.shift();

		var playerMovement = this.game.add.tween(this);

		playerMovement.to({x: position.x * 32 * this.game.scaleFactor, y: position.y * 32 * this.game.scaleFactor}, 100);

		playerMovement.onComplete.add(function(){
			this.move(paths);
		}, this);

		playerMovement.start();
	} else {
		this.game.input.enabled = true;
	}
}
