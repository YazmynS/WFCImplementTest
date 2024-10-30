class Map extends Phaser.Scene {
    constructor() {
        super('mapScene');

        // Define tile variables for readability
        this.topLeftMountain = 73;
        this.topMiddleMountain = 74;
        this.topRightMountain = 75;
        this.middleLeftMountain = 90;
        this.middleMiddleMountain = 91;
        this.middleRightMountain = 92;
        this.bottomLeftMountain = 107;
        this.bottomMiddleMountain = 108;
        this.bottomRightMountain = 109;

        this.topLeftGrass = 5;
        this.topMiddleGrass = 6;
        this.topRightGrass = 7;
        this.middleLeftGrass = 22;
        this.middleMiddleGrass = 23;
        this.middleRightGrass = 24;
        this.bottomLeftGrass = 39;
        this.bottomMiddleGrass = 40;
        this.bottomRightGrass = 41;

        this.water = [186, 202, 203];
    }

    create() {
        this.scaleFactor = 0.5;
        this.width = (20 * widthFactor) / this.scaleFactor;
        this.height = (15 * heightFactor) / this.scaleFactor;

        // Define terrain groups using class-level constants
        const land = [
            this.topLeftGrass, this.topMiddleGrass, this.topRightGrass,
            this.middleLeftGrass, this.middleMiddleGrass, this.middleRightGrass,
            this.bottomLeftGrass, this.bottomMiddleGrass, this.bottomRightGrass
        ];
        const mountain = [
            this.topLeftMountain, this.topMiddleMountain, this.topRightMountain,
            this.middleLeftMountain, this.middleMiddleMountain, this.middleRightMountain,
            this.bottomLeftMountain, this.bottomMiddleMountain, this.bottomRightMountain
        ];

        this.world = { water: this.water, land, mountain };

        // Updated adjacency rules favoring continuity in land and water regions
        this.adjacencyRules = {
            [this.topLeftGrass]: [this.middleLeftGrass, this.bottomLeftGrass, this.topMiddleGrass, this.topRightGrass, ...this.water],
            [this.topMiddleGrass]: [this.topLeftGrass, this.topRightGrass, this.middleMiddleGrass, this.bottomMiddleGrass, ...this.water],
            [this.topRightGrass]: [this.topMiddleGrass, this.middleRightGrass, this.bottomRightGrass, ...this.water],
            [this.middleLeftGrass]: [this.topLeftGrass, this.middleMiddleGrass, this.bottomLeftGrass, ...this.water],
            [this.middleMiddleGrass]: [
                this.topLeftGrass, this.topMiddleGrass, this.topRightGrass, this.middleLeftGrass, this.middleRightGrass,
                this.bottomLeftGrass, this.bottomMiddleGrass, this.bottomRightGrass
            ],
            [this.middleRightGrass]: [this.topRightGrass, this.middleMiddleGrass, this.bottomRightGrass, ...this.water],
            [this.bottomLeftGrass]: [this.middleLeftGrass, this.bottomMiddleGrass, this.topLeftGrass, this.topMiddleGrass, this.topRightGrass, ...this.water],
            [this.bottomMiddleGrass]: [this.bottomLeftGrass, this.bottomRightGrass, this.middleMiddleGrass, this.topMiddleGrass, ...this.water],
            [this.bottomRightGrass]: [this.bottomMiddleGrass, this.middleRightGrass, this.topMiddleGrass, ...this.water],

            [this.topLeftMountain]: [this.middleLeftMountain, this.bottomLeftMountain, this.topMiddleMountain, this.topRightMountain, ...this.water],
            [this.topMiddleMountain]: [this.topLeftMountain, this.topRightMountain, this.middleMiddleMountain, this.bottomMiddleMountain, ...this.water],
            [this.topRightMountain]: [this.topMiddleMountain, this.middleRightMountain, this.bottomRightMountain, ...this.water],
            [this.middleLeftMountain]: [this.topLeftMountain, this.middleMiddleMountain, this.bottomLeftMountain, ...this.water],
            [this.middleMiddleMountain]: [
                this.topLeftMountain, this.topMiddleMountain, this.topRightMountain, this.middleLeftMountain, this.middleRightMountain,
                this.bottomLeftMountain, this.bottomMiddleMountain, this.bottomRightMountain
            ],
            [this.middleRightMountain]: [this.topRightMountain, this.middleMiddleMountain, this.bottomRightMountain, ...this.water],
            [this.bottomLeftMountain]: [this.middleLeftMountain, this.bottomMiddleMountain, this.topLeftMountain, this.topMiddleMountain, this.topRightMountain, ...this.water],
            [this.bottomMiddleMountain]: [this.bottomLeftMountain, this.bottomRightMountain, this.middleMiddleMountain, this.topMiddleMountain, ...this.water],
            [this.bottomRightMountain]: [this.bottomMiddleMountain, this.middleRightMountain, this.topMiddleMountain, ...this.water],

            // General water adjacency rule
            [this.water[0]]: land.concat(mountain, this.water),
            [this.water[1]]: land.concat(mountain, this.water),
            [this.water[2]]: land.concat(mountain, this.water)
        };

        this.generateMap();
        this.player = new Player(this, 0, 0);
    }

    generateMap() {
        const map = this.initializeSuperpositions();
        this.runWFC(map);
        this.renderMap(map);
    }

    initializeSuperpositions() {
        const map = [];
        for (let i = 0; i < this.height; i++) {
            map.push([]);
            for (let j = 0; j < this.width; j++) {
                if (i === 0 || j === 0 || i === this.height - 1 || j === this.width - 1) {
                    // Restrict outer edges to water to form a natural boundary
                    map[i].push([...this.water]);
                } else {
                    map[i].push([
                        this.topLeftGrass, this.topMiddleGrass, this.topRightGrass,
                        this.middleLeftGrass, this.middleMiddleGrass, this.middleRightGrass,
                        this.bottomLeftGrass, this.bottomMiddleGrass, this.bottomRightGrass,
                        this.topLeftMountain, this.topMiddleMountain, this.topRightMountain,
                        this.middleLeftMountain, this.middleMiddleMountain, this.middleRightMountain,
                        this.bottomLeftMountain, this.bottomMiddleMountain, this.bottomRightMountain,
                        ...this.water
                    ]);
                }
            }
        }
        return map;
    }

    runWFC(map) {
        let isComplete = false;
        while (!isComplete) {
            let { x, y } = this.findLowestEntropyCell(map);
            const chosenTile = this.chooseRandomTile(map[y][x]);
            map[y][x] = [chosenTile];
            this.propagate(map, x, y);
            isComplete = this.isFullyCollapsed(map);
        }
    }

    findLowestEntropyCell(map) {
        let minOptions = Infinity;
        let coords = { x: 0, y: 0 };
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const options = map[y][x];
                if (options.length > 1 && options.length < minOptions) {
                    minOptions = options.length;
                    coords = { x, y };
                }
            }
        }
        return coords;
    }

    chooseRandomTile(options) {
        return options[Math.floor(Math.random() * options.length)];
    }

    propagate(map, x, y) {
        const tile = map[y][x][0];
        const validAdjacency = this.adjacencyRules[tile];
        if (!validAdjacency) return;
        
        const directions = [
            { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
            { dx: -1, dy: 0 }, { dx: 1, dy: 0 }
        ];
    
        for (const { dx, dy } of directions) {
            const nx = x + dx;
            const ny = y + dy;
            if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width) {
                if (map[ny][nx] && map[ny][nx].length > 1) {
                    map[ny][nx] = map[ny][nx].filter(option => validAdjacency.includes(option));
                    if (map[ny][nx].length === 1) {
                        this.propagate(map, nx, ny);
                    }
                }
            }
        }
    }

    isFullyCollapsed(map) {
        return map.every(row => row.every(cell => cell.length === 1));
    }

    renderMap(map) {
        const waterLayer = [];
        const landLayer = [];
        const mountainLayer = [];
    
        for (let y = 0; y < this.height; y++) {
            waterLayer.push([]);
            landLayer.push([]);
            mountainLayer.push([]);
            for (let x = 0; x < this.width; x++) {
                const tile = map[y][x][0];
                switch (tile) {
                    case this.water[0]:
                    case this.water[1]:
                    case this.water[2]:
                        waterLayer[y].                        push(tile);
                        landLayer[y].push(blank);
                        mountainLayer[y].push(blank);
                        break;
                    case this.middleMiddleGrass:
                        waterLayer[y].push(blank);
                        landLayer[y].push(this.middleMiddleGrass);
                        mountainLayer[y].push(blank);
                        break;
                    case this.topLeftGrass:
                    case this.topMiddleGrass:
                    case this.topRightGrass:
                    case this.middleLeftGrass:
                    case this.middleRightGrass:
                    case this.bottomLeftGrass:
                    case this.bottomMiddleGrass:
                    case this.bottomRightGrass:
                        waterLayer[y].push(blank);
                        landLayer[y].push(tile);
                        mountainLayer[y].push(blank);
                        break;
                    case this.topLeftMountain:
                    case this.topMiddleMountain:
                    case this.topRightMountain:
                    case this.middleLeftMountain:
                    case this.middleMiddleMountain:
                    case this.middleRightMountain:
                    case this.bottomLeftMountain:
                    case this.bottomMiddleMountain:
                    case this.bottomRightMountain:
                        waterLayer[y].push(blank);
                        landLayer[y].push(blank);
                        mountainLayer[y].push(tile);
                        break;
                    default:
                        waterLayer[y].push(blank);
                        landLayer[y].push(blank);
                        mountainLayer[y].push(blank);
                        break;
                }
            }
        }
    
        const waterMap = this.make.tilemap({
            data: waterLayer,
            tileWidth: tileSize,
            tileHeight: tileSize
        });
    
        const tilesheet = waterMap.addTilesetImage('tiles');
        const wlayer = waterMap.createLayer(0, tilesheet, 0, 0);
        wlayer.setScale(this.scaleFactor);
    
        const landMap = this.make.tilemap({
            data: landLayer,
            tileWidth: tileSize,
            tileHeight: tileSize
        });
    
        const landTilesheet = landMap.addTilesetImage('tiles');
        const llayer = landMap.createLayer(0, landTilesheet, 0, 0);
        llayer.setScale(this.scaleFactor);

        const mountainMap = this.make.tilemap({
            data: mountainLayer,
            tileWidth: tileSize,
            tileHeight: tileSize
        });

        const mountainTilesheet = mountainMap.addTilesetImage('tiles');
        const mlayer = mountainMap.createLayer(0, mountainTilesheet, 0, 0);
        mlayer.setScale(this.scaleFactor);
    }

    rectangularSlice(arr, height, verticalGap = 0) {
        let array = [];
        let width = arr.length;

        for (let y = 0; y < height; y++) {
            array.push([]);
            for (let x = 0; x < width; x++) {
                array[y].push(arr[y] + gap * (x + verticalGap));
            }
        }

        return array;
    }
}

