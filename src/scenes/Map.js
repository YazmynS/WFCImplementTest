class Map extends Phaser.Scene {
    constructor() {
        super('mapScene');
    }

    create() {
        const lookup = [
            null,
            null,
            null,
            null,
            null,
            [2, 0], // bottom-left
            [0, 0], // top-left
            [1, 0], // middle-left
            null,
            [2, 2], // bottom-right
            [0, 2], // top-right
            [1, 2], // middle-right
            null,
            [2, 1], // bottom-middle
            [0, 1], // top-middle
            [1, 1]  // floor
        ];

        noise.seed(Math.random());

        this.gap = 17;

        this.scaleFactor = 0.5;

        this.width = (20 * widthFactor) / this.scaleFactor;
        this.height = (15 * heightFactor) / this.scaleFactor;

        let water = [186, 202, 203];

        let landArr = [5, 6, 7];
        let landOffset = 0;
        let land = this.rectangularSlice(landArr, 3, landOffset);

        let mountainArr = [5, 6, 7];
        let mountainOffset = 4;
        let mountain = this.rectangularSlice(mountainArr, 3, mountainOffset);

        this.world = [water, land, mountain];
        let worldSyms = ['~', '-', '^'];
        
        // arr determines tile types based on noise values
        const arr = [];

        for (let i = 0; i < this.height; i++) {
            arr.push([])
            for (let j = 0; j < this.width; j++) {
                let x = this.noiseValue(i, j);

                let tile;

                // Technically, the edges of the map are offscreen.

                // This is because there are certain edge cases due to the nature of how adjacent tiles are limited by the map's boundaries.
                // This is strictly a limitation of the tilesheet given (there are no tiles that can represent an extension of a tile type in one tile width direction)

                tile = this.threeSection(x, worldSyms);

                arr[i].push(tile);
            }
        }

        // arrValues determines specific tiles to be used based on the tile types determined by arr
        const arrValues = [];
        for (let i = 0; i < this.height; i++) {
            arrValues.push([]);
            for (let j = 0; j < this.width; j++) {
                let char = arr[i][j];

                let type = this.tileType(char);

                let code = this.tileCode(arr, i, j, char);

                if (type === water || lookup[code] === null) {
                    arrValues[i].push(this.threeSection(this.noiseValue(i, j), water));
                    continue;
                }

                let [x, y] = lookup[code];

                let tile = type !== water ? type[y][x] : this.threeSection(this.noiseValue(i, j), water);

                arrValues[i].push(tile);
            }
        }

        const map = this.make.tilemap({
            data: arrValues,      // load direct from array
            tileWidth: 64,
            tileHeight: 64
        })

        const tilesheet = map.addTilesetImage('tiles');

        const layer = map.createLayer(0, tilesheet, 0, 0);

        layer.setScale(this.scaleFactor);

        this.reload = this.input.keyboard.addKey('R')
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.reload)) {
            this.scene.restart()
        }
    }

    noiseValue(i, j) {
        let value = noise.simplex2(i / 100, j / 100);
        return Math.round(Math.abs(value) * 256);
    }

    threeSection(noiseValue, vals) {
        // Given a noiseValue and an array of three values,
        // returns the value from the array at an index determined by splitting the total noiseValue range into three sections.

        // Note: the lower the noiseValue, the lower in depth the tile will be.

        if (noiseValue < 85) {
            return vals[0];
        } else if (noiseValue < 170) {
            return vals[1];
        } else {
            return vals[2];
        }
    }

    rectangularSlice(arr, height, verticalGap = 0) {
        // Given the width and height, where width is the length of the array, and verticalGap is the vertical offset from the top of the tilesheet,
        // returns a 2D array representing a rectangular slice of the specified area in the tilesheet.

        // Note: arr is an array containing each value from arr[0] to arr[arr.length - 1] in the horizontal axis of the tilesheet to specify where to start the slice.
        // Essentially, arr determines the x coordinates, while height and verticalGap determine the y coordinates.

        // Returns array[y][x], where y is the vertical slice and x is the horizontal slice.

        let array = [];
        let width = arr.length;

        for (let y = 0; y < height; y++) {
            array.push([]);
            for (let x = 0; x < width; x++) {
                array[y].push(arr[y] + this.gap * (x + verticalGap));
            }
        }

        return array;
    }

    tileType(char) {
        // Given a character, returns the corresponding tile index.

        let tile;

        switch (char) {
            case '~':
                tile = this.world[0];
                break;
            case '-':
                tile = this.world[1];
                break;
            case '^':
                tile = this.world[2];
                break;
            default:
                tile = this.world[0];
                console.log('Invalid character. Defaulting to water tile.');
                break;
        }

        return tile;
    }

    tileCode(arr, i, j, target) {
        const northBit = this.tileCheck(arr, i - 1, j, target) ? 1 : 0;
        const southBit = this.tileCheck(arr, i + 1, j, target) ? 1 : 0;
        const eastBit = this.tileCheck(arr, i, j + 1, target) ? 1 : 0;
        const westBit = this.tileCheck(arr, i, j - 1, target) ? 1 : 0;
      
        // Form the 4-bit code using bitwise operations
        const code =
          (northBit << 0) + (southBit << 1) + (eastBit << 2) + (westBit << 3);
        
        return code;
    }

    tileCheck(arr, i, j, target) {
        return arr[i] && arr[i][j] === target;
    }
}
