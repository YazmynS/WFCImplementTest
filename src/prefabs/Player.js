class Player {
    constructor(scene, x, y) {
        this.scene = scene;

        this.playerSprites = scene.rectangularSlice(playerArr, 2, playerArrOffset);

        this.sprite = this.playerSprites[0][0];

        let playerLayer = [];

        for (let i = 0; i < scene.height; i++) {
            playerLayer.push([]);
            for (let j = 0; j < scene.width; j++) {
                playerLayer[i].push(blank);
            }
        }

        this.map = scene.make.tilemap({
            data: playerLayer,
            tileWidth: tileSize,
            tileHeight: tileSize
        });

        const tilesheet = this.map.addTilesetImage('tiles');

        const layer = this.map.createLayer(0, tilesheet, 0, 0);

        layer.setScale(scene.scaleFactor);
        layer.setDepth(3);

        this.map.putTileAt(this.sprite, x, y);

        this.x = x;
        this.y = y;

        // Arrow Keys

        scene.input.keyboard.on('keydown-W', () => {
            this.moveUp();
        });

        scene.input.keyboard.on('keydown-S', () => {
            this.moveDown();
        });

        scene.input.keyboard.on('keydown-A', () => {
            this.moveLeft();
        });

        scene.input.keyboard.on('keydown-D', () => {
            this.moveRight();
        });

        this.tileTypes = ["Water", "Land", "Mountain"];

        this.tileType = this.tileTypes[0];

        this.tileStatus = scene.add.text(centerX - centerX/5, 10, 'Player is on: ' + this.tileType, { fontFamily: 'Arial', fontSize: '24px', color: '#000000' });
        this.tileStatus.setDepth(3);
    }

    tileUpdate() {
        if (this.scene.map != null) {
            switch (this.scene.map[this.y][this.x]) {
                case '~':
                    this.tileType = this.tileTypes[0];
                    break;
                case '-':
                    this.tileType = this.tileTypes[1];
                    break;
                case '^':
                    this.tileType = this.tileTypes[2];
                    break;
                default:
                    this.tileType = this.tileTypes[0];
                    console.log("Invalid type");
                    break;
            }

            this.tileStatus.text = 'Player is on: ' + this.tileType;
        }
    }

    moveRight() {
        if (this.x < this.scene.width - 1) {
            this.map.putTileAt(blank, this.x, this.y);
            this.map.putTileAt(this.sprite, ++this.x, this.y);
            this.tileUpdate();
        }
    }

    moveLeft() {
        if (this.x > 0) {
            this.map.putTileAt(blank, this.x, this.y);
            this.map.putTileAt(this.sprite, --this.x, this.y);
            this.tileUpdate();
        }
    }

    moveUp() {
        if (this.y > 0) {
            this.map.putTileAt(blank, this.x, this.y);
            this.map.putTileAt(this.sprite, this.x, --this.y);
            this.tileUpdate();
        }
    }

    moveDown() {
        if (this.y < this.scene.height - 1) {
            this.map.putTileAt(blank, this.x, this.y);
            this.map.putTileAt(this.sprite, this.x, ++this.y);
            this.tileUpdate();
        }
    }

    changeSprite() {
        if (selectedSprite == 0) {
            this.sprite = this.playerSprites[0][0];
        } else if (selectedSprite == 1) {
            this.sprite = this.playerSprites[0][1];
        } else if (selectedSprite == 2) {
            this.sprite = this.playerSprites[1][0];
        } else {
            this.sprite = this.playerSprites[1][1];
        }

        this.map.putTileAt(this.sprite, this.x, this.y);
    }
}