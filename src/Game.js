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
			this.game.scaleFactor = this.scale;

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

			this.player = new Character(this.game, 64, 64, 'player');
			this.add.existing( this.player );

			this.player.animations.add('idle', [0, 1], 2, true);
			this.player.animations.play('idle');

			this.game.camera.follow(this.player);
		},
		mouseClicked: function(aa, event) {
			this.game.input.enabled = false;
			var x = (event.x + this.game.camera.x) / this.scale;
			var y = (event.y + this.game.camera.y) / this.scale;

			var tile = this.map.getTileWorldXY(x, y);

		 	var playerStart = this.map.getTileWorldXY(this.player.x / this.scale, this.player.y / this.scale);

			var pf = new PathFinding(this.mapGrid, this.mapWidth, this.mapHeight);
			this.player.move( pf.find({x: playerStart.x, y: playerStart.y}, {x:tile.x, y:tile.y}));
		}

};
