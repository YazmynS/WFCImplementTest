let config = {
    type: Phaser.WEBGL,
    width: 1200,
    height: 675,
    pixelArt: true,
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