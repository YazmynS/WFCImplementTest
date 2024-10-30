let widthFactor = 1;
let heightFactor = 1;

let config = {
    type: Phaser.WEBGL,
    width: 1280 * widthFactor,
    height: 960 * heightFactor,
    pixelArt: true,
    parent: 'game',
    scale: {
        //mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            fps: 60
        }
    },
    scene: [ Load, Map ]
}

let game = new Phaser.Game(config);

let w = game.config.width;
let h = game.config.height;

let centerX = game.config.width / 2;
let centerY = game.config.height / 2;

const tileSize = 64;
const gap = 17;
const blank = -1;

const landArr = [5, 6, 7]; //Top left, top middle, top right, top 
const landOffset = 0;

const mountainArr = [5, 6, 7];
const mountainOffset = 4;

const landDecorArr = [8, 9];
const landDecorOffset = 2;

const mountainDecorArr = [8, 9];
const mountainDecorOffset = 6;

const playerArr = [15, 16];
const playerArrOffset = 8;

let worldSyms = ['~', '-', '^'];

let noiseSampleWindow = 10;

const lookup = [
    [1, 1],
    [2, 1],
    [0, 0],
    [1, 0],
    [0, 0],
    [2, 0], // bottom-left
    [0, 0], // top-left
    [1, 0], // middle-left
    [2, 2],
    [2, 2], // bottom-right
    [0, 2], // top-right
    [1, 2], // middle-right
    [0, 1],
    [2, 1], // bottom-middle
    [0, 1], // top-middle
    [1, 1]  // floor
];

const decorPlacementLookup = [
    true,
    false,
    true,
    true,
    true,
    false, // bottom-left
    true, // top-left
    true, // middle-left
    false,
    false, // bottom-right
    true, // top-right
    true, // middle-right
    true,
    false, // bottom-middle
    true, // top-middle
    true  // floor
];

let waterThreshold = 85;

let landThreshold = 170;

let mountainThreshold = 255;

// Place text below the game canvas to display instructions
let instructions = document.createElement('div');
instructions.innerHTML = 'Use the <strong>comma (,)</strong> and <strong>period (.)</strong> keys to adjust the noise sample window size. Use the <strong>R</strong> key to reseed the map.';
document.body.appendChild(instructions);

// Place text below instructions for player controls
let controls = document.createElement('div');
controls.innerHTML = 'Use the <strong>WASD</strong> to move the player.';
document.body.appendChild(controls);

// Create drop down menu for player sprites
let playerSprites = document.createElement('select');
playerSprites.id = 'playerSprites';
// add 4 players to the drop down menu
playerSprites.innerHTML = '<option value="0">Player 1</option><option value="1">Player 2</option><option value="2">Player 3</option><option value="3">Player 4</option>';
document.body.appendChild(playerSprites);

let selectedSprite = 0;

document.getElementById('playerSprites').addEventListener('change', function() {
    selectedSprite = this.value;
});