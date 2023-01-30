// create scene
let gameScene = new Phaser.Scene("Game");

// configuration game
let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene // our scene
};

// create game, pass config
let game = new Phaser.Game(config);

// некоторые параметры для сцены(это наши параметры, они не являются частью Phaser API)
gameScene.init = function() {
    this.playerSpeed = 1.5;
    this.enemyMaxY = 280;
    this.enemyMinY = 80;
}

// load or preload assets
gameScene.preload = function() {
    // load image
    this.load.image("background", "assets/background.png");

    // player and other
    this.load.image("player", "assets/player.png");
    this.load.image("dragon", "assets/dragon.png");
    this.load.image("treasure", "assets/treasure.png");
};

// run once, after load assets
gameScene.create = function() {
    //background
    this.add.sprite(320, 180, "background"); // можно сделать экземпляр этого дела и поставить ему .setOrigin(0, 0);

    // player
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, "player");

    // resize
    this.player.setScale(0.5); // прямой доступ scaleX, scaleY

    // добавим сокровища
    this.treasure = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, "treasure");
    this.treasure.setScale(0.5);

    // add dragon group
    this.enemies = this.add.group({
        key: "dragon",  // по ключу dragon
        repeat: 5,      // создаем 5шт драконов
        setXY: {
            x: 110,     // координаты по X где ставим
            y: 100,     // координаты по Y где ставим
            stepX: 80,  // шаг, где ставим следующего по X
            stepY: 20   // шаг, где ставим следующего по Y
        }
    });

    // resize dragon
    // Phaser.Actions.ScaleXY - метод для уменьшения масштаба для всех передаваемых спрайтов
    // getChildren возвращает массив со всеми спрайтами, которые принадлежат группе
    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);

    // speed enemy
    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy) {
        enemy.speed = Math.random() * 2 + 1;
    }, this);

    // the flag about player is alive
    this.isPlayerAlive = true;

    // перезапуск эффектов камеры
    this.cameras.main.resetFX();
}

// update the scene
gameScene.update = function() {
    // run this code if player is alive
    if (!this.isPlayerAlive) {
        return;
    }

    // check active enter
    if (this.input.activePointer.isDown) {
        // move player
        this.player.x += this.playerSpeed;
    }

    // проверка коллизии, но без физики движка, с помощью служебного метода перекрытия двух объектов
    if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.treasure.getBounds())) {
        this.gameOver();
    }

    // move enemies
    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for (let i = 0; i < numEnemies; i++) {
        // перемещаем каждого из врагов
        enemies[i].y += enemies[i].speed;

        // разворачиваем движение, если враг достиг границы
        if (enemies[i].y >= this.enemyMaxY && enemies[i].speed > 0) {
            enemies[i].speed *= -1;
        } 
        else if (enemies[i].y <= this.enemyMinY && enemies[i].speed < 0) {
            enemies[i].speed *= -1;
        }

        // столкновение с врагами
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), enemies[i].getBounds())) {
            this.gameOver();
            break;
        }
    }
}

gameScene.gameOver = function() {
    // the flag about player is dead
    this.isPlayerAlive = false;

    // дрожание камеры
    this.cameras.main.shake(500);

    // затухание камеры через 250мс
    this.time.delayedCall(250, function() {
        this.cameras.main.fade(250);    // затухание (fade - тень) камеры в течении 250мс
    }, [], this);                       // после затухания надо перезапустить эффект камеры resetFX()

    // restart the scene from 500ms
    this.time.delayedCall(500, function() {
        this.scene.restart();
    }, [], this);
}