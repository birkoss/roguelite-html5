BasicGame = {

};

BasicGame.Game = function (game) {
};

BasicGame.Game.prototype = {

		init: function () {
				// set up input max pointers
				this.input.maxPointers = 1;

				this.stage.disableVisibilityChange = true;

				this.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;

				// Force Portrait Orientation
				this.scale.forceOrientation(false, true);
		},

		preload: function () {
				this.load.spritesheet('floor', 'assets/floors.png', 16, 16, 10);
				this.load.spritesheet('player', 'assets/player.png', 32, 32, 2);
				this.load.image('tiles', 'assets/floors.png');
		},

		create: function () {
			var data = '';

			this.mapGrid = [];
			this.mapWidth = 128;
			this.mapHeight = 128;

			for (var y = 0; y < this.mapHeight; y++) {
				for (var x = 0; x < this.mapWidth; x++) {
					this.mapGrid.push( 0 );
					// data += this.rnd.between(0, 10).toString();
					data += 9;

					if (x < 127) {
							data += ',';
					}
				}

				if (y < 127) {
					data += "\n";
				}
			}
			// console.log(data);

			this.scale = Math.max(window.devicePixelRatio, 2);

			this.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

			this.map = this.add.tilemap('dynamicMap', 32, 32);

			this.map.addTilesetImage('tiles', 'tiles', 32, 32);

			layer = this.map.createLayer(0);
			layer.scale = {x: this.scale, y: this.scale};

			layer.resizeWorld();
			// console.log('Layer: ' + layer.inputEnable);
			// layer.inputEnable = true;
			this.game.input.onDown.add(this.mouseClicked, this);

			this.physics.startSystem(Phaser.Physics.ARCADE);

			cursors = this.input.keyboard.createCursorKeys();

			var style = { font: "20px Arial", fill: "#fff"};

			this.add.text(10, 20, "Health:" + this.scale, style);

			this.player = this.add.sprite(0, 0, 'player', 0);
			this.player.scale = {x: this.scale, y: this.scale};

			this.player.animations.add('idle', [0, 1], 2, true);
			this.player.animations.play('idle');

			this.player2 = this.add.sprite(0, 32 * this.scale, 'player', 0);
			//this.player2.scale = {x: scale, y: scale};
		},
		mouseClicked: function(aa, event) {
			console.log("Original: " + event.x + "x" + event.y);
			console.log("Scale: " + this.scale);
			var x = event.x / this.scale;
			var y = event.y / this.scale;

			var tile = this.map.getTileWorldXY(x, y);

		 	var playerStart = this.map.getTileWorldXY(this.player.x / this.scale, this.player.y / this.scale);
			console.log( playerStart);

			var pf = new PathFinding(this.mapGrid, this.mapWidth, this.mapHeight);
			this.remainingPaths = pf.find({x: playerStart.x, y: playerStart.y}, {x:tile.x, y:tile.y});

			console.log(this.remainingPaths);

			this.move();
			// var map = [0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0	];
			// var pf = new PathFinding(map, 5, 5);
			// console.log( pf.find({x: 0, y: 0}, {x:4, y:4}) );
		}

};

BasicGame.Game.prototype.move = function() {
	if( this.remainingPaths.length > 0 ) {
		var position = this.remainingPaths.shift();

		var playerMovement = this.game.add.tween(this.player);

		playerMovement.to({x: position.x * 32 * this.scale, y: position.y * 32 * this.scale}, 100);

		playerMovement.onComplete.add(function(){
			this.move();
		}, this);

		playerMovement.start();
	}
}
