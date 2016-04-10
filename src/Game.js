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
				this.load.image('logo', 'asset/phaser.png');
				this.load.spritesheet('floor', 'assets/floors.png', 16, 16, 10);
				this.load.spritesheet('player', 'assets/player.png', 32, 32, 2);
				this.load.image('tiles', 'assets/floors.png');
		},

		create: function () {
			var data = '';

			for (var y = 0; y < 128; y++) {
				for (var x = 0; x < 128; x++) {
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
			console.log(tile);

			console.log("Clicked on " + x + "x" + y);

			var playerMovement = this.game.add.tween(this.player);

			playerMovement.to({x: tile.x * tile.width * this.scale, y: tile.y * tile.height * this.scale}, 700);

			playerMovement.onComplete.add(function(){
				//this.uiBlocked = false;
			}, this);

			playerMovement.start();

			var map = [0, 1,
				          1, 0,];
			var pf = new PathFinding(map, 2, 2);
			console.log( pf.find({x: 0, y: 0}, {x:1, y:1}) );
			// var map = [0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0,
			//           0, 0, 0, 0, 0	];
			// var pf = new PathFinding(map, 5, 5);
			// console.log( pf.find({x: 0, y: 0}, {x:4, y:4}) );
		}

};
