class Map extends Phaser.Scene {
    constructor() {
        super('mapScene');
    }

    create() {
        noise.seed(Math.random());

        this.gap = 17;

        let water = [186, 202, 203];

        let landArr = [5, 6, 7];
        let landOffset = 0;
        let land = this.rectangularSlice(landArr, 3, landOffset);

        let mountainArr = [5, 6, 7];
        let mountainOffset = 4;
        let mountain = this.rectangularSlice(mountainArr, 3, mountainOffset);

        let world = [land[1][1], mountain[1][1], water[0]];
        
        // create a 2D array of tile indices
        const arr = [];

        // fill arr with tile indices
        for (let i = 0; i < 11; i++) {
            arr.push([])
            for (let j = 0; j < 19; j++) {
                let x = this.noiseValue(i, j);

                let tile;

                // tile = this.threeSection(x, water);

                tile = this.threeSection(x, world);

                arr[i].push(tile);
            }
        }


        const map = this.make.tilemap({
            data: arr,      // load direct from array
            tileWidth: 64,
            tileHeight: 64
        })

        const tilesheet = map.addTilesetImage('tiles');

        const layer = map.createLayer(0, tilesheet, 0, 0);

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
}
