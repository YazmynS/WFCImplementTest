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
    scene: [ Load ]
}

let game = new Phaser.Game(config);

let w = game.config.width;
let h = game.config.height;