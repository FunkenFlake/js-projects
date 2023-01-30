// загрузочная сцена
var BootScene = new Phaser.Class ({
    Extends: Phaser.Scene,
    initialize:

    function BootScene () {
        Phaser.Scene.call(this, {key: "BootScene"});
    },

    preload: function() {
        // загрузка ресурсов
        this.load.image("tiles", "assets/map/spritesheet.png");
        
        // загрузка карты в json
        this.load.tilemapTiledJSON("map", "assets/map/map.json");

        // наши два персонажа
        this.load.spritesheet("player", "assets/RPG_assets.png", {frameWidth: 16, frameHieght: 16});
    },

    create: function() {
        this.scene.start("WorldScene");
    }
});

// сцена мира
var WorldScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function WorldScene() {
        Phaser.Scene.call(this, {key: "WorldScene"});
    },

    preload: function() {

    },

    create: function() {
        // рисуем сцену мира
        var map = this.make.tilemap({key: "map"}); // key: "map" - мы присвоили, когда загружали карту через json
        
        // добавляем тайлы карты
        var tiles = map.addTilesetImage("spritesheet", "tiles");    // создаем изображения для тайлов

        var grass = map.createStaticLayer("Grass", tiles, 0, 0);    // добавляем слой на карту, следующая строка аналогична
        var obstacles = map.createStaticLayer("Obstacles", tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);                    // устанавливаем определение столкновений со всеми тайлами в этом слое

        // добавляем игрока
        this.player = this.physics.add.sprite(50, 100, "player", 6);
    }

});

var config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true, // предотвращает размытие текстур при масштабировании
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0}
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};

// игра
var game = new Phaser.Game(config);