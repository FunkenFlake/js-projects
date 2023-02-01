// создаем базовый класс юнитов
var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // урон по умолчанию
    },
    attack: function(target) {
        target.takeDamage(this.damage); 
    },
    takeDamage: function(damage) {
        this.hp -= damage;
    }
});

// создаем врага




// Сцены
// BOOT
var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function BootScene() {
        Phaser.Scene.call(this, {key: "BootScene"});
    },

    preload: function() {
        // load resources
        this.load.spritesheet("player", "assets/RPG_assets.png", {frameWidth: 16, frameHeight: 16});
        this.load.image("dragonblue", "assets/dragonblue.png");
        this.load.image("dragonorange", "assets/dragonorrange.png");
    },

    create: function() {
        this.scene.start("BattleScene");
    }
});


// BATTLE
var BattleScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function BattleScene() {
        Phaser.Scene.call(this, {key: "BattleScene"});
    },

    create: function() {
        // одновременно запускаем сцену UI Scene
        this.scene.launch("UIScene");
    }
});


//UI
var UIScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function UIScene () {
        Phaser.Scene.call(this, {key: "UIScene"});
    },

    create: function () {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);
    }
});

var config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },

    scene: [BootScene, BattleScene, UIScene]
};

// запуск
var game = new Phaser.Game(config);

