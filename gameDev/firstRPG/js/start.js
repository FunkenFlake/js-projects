var config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true, // предотвращает размытие текстур при масштабировании
    physics: {
        default: "arcade",  // позволит перемещать персонажа
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: [
        BootScene,
        WorldScene,
        BattleScene,
        UIScene,
    ]
};

// игра
var game = new Phaser.Game(config);