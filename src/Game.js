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
				this.load.image('decors', 'assets/decors.png');
		},

		create: function () {
			var data = '';

			this.mapGrid = [];
			this.mapWidth = 20;
			this.mapHeight = 20;

			this.scale = Math.max(window.devicePixelRatio, 2);
			this.scale = 2;
			this.game.scaleFactor = this.scale;

			// this.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);

			this.map = this.add.tilemap();//'dynamicMap', 32, 32);

			this.map.addTilesetImage('tiles', 'tiles', 32, 32, null, null, 0);
			// this.map.addTilesetImage('decors', 'decors', 32, 32, null, null, 1);

			layer = this.map.create('layer', this.mapWidth, this.mapHeight, 32, 32);
			layer.resizeWorld();
			layer.scale = {x: this.scale, y: this.scale};


			for (var y = 0; y < this.mapHeight; y++) {
				for (var x = 0; x < this.mapWidth; x++) {
					this.mapGrid.push( 0 );
					this.map.putTile(4, x, y, layer)
				}
			}

			this.map.putTile(2, 0, 0, layer);



			// console.log('Layer: ' + layer.inputEnable);
			// layer.inputEnable = true;
			 this.game.input.onDown.add(this.mouseClicked, this);

			this.physics.startSystem(Phaser.Physics.ARCADE);

			cursors = this.input.keyboard.createCursorKeys();


			var style = { font: "20px Arial", fill: "#fff"};

			this.add.text(10, 20, "Health:" + this.scale, style);

			this.player = new Character(this.game, 128, 128, 'player');
			this.add.existing( this.player );

			this.player.animations.add('idle', [0, 1], 2, true);
			this.player.animations.play('idle');

			// this.game.camera.follow(this.player);
		},
		mouseClicked: function(aa, event) {
			this.game.input.enabled = false;

			console.log(aa);

			console.log(event);

var style = { font: "20px Arial", fill: "#fff"};


			var x = (event.clientX + this.game.camera.x ) / this.scale;
			var y = (event.clientY + this.game.camera.y ) / this.scale;

this.add.text(10, 50, "CLICKED:" + event.x + "x" + event.offsetX, style);

			var tile = this.map.getTileWorldXY(x, y);

			var playerPosition = this.player.getPosition();
		 	var playerStart = this.map.getTileWorldXY(playerPosition.x, playerPosition.y);

			console.log( playerStart );
			console.log( tile );

			console.log("-----------------");

			var pf = new PathFinding(this.mapGrid, this.mapWidth, this.mapHeight);
			paths = pf.find({x: playerStart.x, y: playerStart.y}, {x:tile.x, y:tile.y});
			this.player.move( paths );
		}

};
