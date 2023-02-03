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

        // враги
        this.load.image("dragonblue", "assets/dragonblue.png");
        this.load.image("dragonorange", "assets/dragonorrange.png");
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

        console.log("from create");
        // рисуем сцену мира
        var map = this.make.tilemap({key: "map"}); // key: "map" - мы присвоили, когда загружали карту через json
        
        // добавляем тайлы карты
        var tiles = map.addTilesetImage("spritesheet", "tiles");    // создаем изображения для тайлов

        var grass = map.createStaticLayer("Grass", tiles, 0, 0);    // добавляем слой на карту, следующая строка аналогична (тут мы добавили траву, а ниже препядствия)
        var obstacles = map.createStaticLayer("Obstacles", tiles, 0, 0);
        obstacles.setCollisionByExclusion([-1]);                    // устанавливаем определение столкновений со всеми тайлами в этом слое, за исключением тех чьи индексы -1

        // добавляем игрока (для отслеживания коллизий игрока создаем его с помощью физики physics.add.sprite)
        this.player = this.physics.add.sprite(50, 100, "player", 6);    // последний параметр это кадр (из всего набора)

        // устанавливаем границы мира
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;

        // для персонажа, чтобы не заходил за границы мира
        this.player.setCollideWorldBounds(true);

        // добавляем считывание клавиш (я так понял)
        this.cursors = this.input.keyboard.createCursorKeys();

        // ограничиваем камеру размерами карты
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // заставляем камеру следовать за игроком
        this.cameras.main.startFollow(this.player);

        // убираем полосы в тайлах
        this.cameras.main.roundPixels = true;

        // далее следует блок анимаций
        // для лево
        this.anims.create({
            key: "left",    // задаем ключ, по нему потом будет воспроизводить
            frames: this.anims.generateFrameNumbers("player", {frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        // для право
        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("player", {frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });

        // для вверх
        this.anims.create({
            key: "up",
            frames: this.anims.generateFrameNumbers("player", {frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });

        // для вниз
        this.anims.create({
            key: "down",
            frames: this.anims.generateFrameNumbers("player", {frames: [0, 6, 0, 12]}),
            frameRate: 10,
            repeat: -1
        });

        // коллизия игрока и слоя препядствий (это деревья)
        this.physics.add.collider(this.player, obstacles);

        // создаем зоны для битвы
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        for (var i = 0; i < 30; i++) {
            var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

            // параметры x, y, width, height
            this.spawns.create(x, y, 20, 20);
        }

        // взаимодествование игрока с зонами (при пересечении их игроком, вызываем onMeetEnemy, т.е. бой)
        this.physics.add.overlap(this.player, this.spawns, this.onMeetEnemy, false, this);
    },

    
    onMeetEnemy: function(player, zone) {
        // перемещаем зону вдругое место
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

        // просто для эффекта 
        this.cameras.main.shake(300);   // встряска
        this.cameras.main.flash(500);   // вспышка

        // начало боя (переход в сцену битвы)
        this.scene.switch("BattleScene");

    },

    update: function(time, delta) {
        // speed of player (сначала ставим 0)
        this.player.body.setVelocity(0);

        // в конце обновляем анимацию и ставим приоритет анимации
        // left/right над анимацией up/down
        // horizontaly move
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
            this.player.anims.play("left", true);
            this.player.flipX = true; // разворачиваем спрайты персонажа по оси X
        }
        else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
            this.player.anims.play("right", true);
            this.player.flipX = false; // не разворачиваем 
        }

        // vertical move
        else if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
            this.player.anims.play("up", true);
        }
        else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
            this.player.anims.play("down", true);
        }
        else {
            this.player.anims.stop();
        }

    },

});