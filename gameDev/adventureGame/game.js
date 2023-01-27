

// конфигурация и экземпляр игры
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};



// переменные для игры
var player;
var stars;
var bombs;
var platforms;
var cursors;
var gameOver = false;

// переменные для подсчета очков
var score = 0;
var scoreText;


// создаем экземпляр игры
var game = new Phaser.Game(config);


function preload() {
    this.load.image("sky", "assets/sky.png");
    this.load.image("ground", "assets/platform.png");
    this.load.image("star", "assets/star.png");
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/dude.png",
        {frameWidth: 32, frameHeight: 48}
    );
}

function create() {
    this.add.image(400, 300, "sky");

    scoreText = this.add.text(16, 16, "score: 0", { fontSize: "32px", fill: "#000"});

    platforms = this.physics.add.staticGroup();
    
    platforms.create(400, 568, "ground").setScale(2).refreshBody();

    platforms.create(600, 400, "ground");
    platforms.create(50, 250, "ground");
    platforms.create(750, 220, "ground");

    player = this.physics.add.sprite(100, 450, "dude");

    player.setBounce(0.2); // устанавливаем отскок (силу отскакиваемости)
    player.setCollideWorldBounds(true); // столкновение с границами мира (чтобы не убежал)

    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", {start: 0, end: 3}),
        frameRate: 10,  // анимация работает со скоростью 10 кадров в секунду
        repeat: -1      // указывает, что анимация зацикливается
    });

    this.anims.create({
        key: "turn",
        frames: [ {key: "dude", frame: 4} ],
        frameRate: 20
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    })

    // player.body.setGravityY(300); // отдельно можно определить физику (в данном случае гравитацию) для игрока

    // добавим звезд
    stars = this.physics.add.group({
        key: "star",
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70}
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // добавим бомб
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    
    cursors = this.input.keyboard.createCursorKeys(); // заполнит объект (cursors) четырьмя свойствами (вверх, вниз, влево, вправо)



    this.physics.add.collider(player, platforms);   // проверяем коллизию между игроком и платформами (группой платформ)
    this.physics.add.collider(stars, platforms);    // проверяем коллизию между звездами и платформами

    // проверяем пересекается ли игрок со звездой
    this.physics.add.overlap(player, stars, collectStar, null, this); // если найдены перекрытия игрока и звезды они передаются в ф-ию collectStar

}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play("left", true);
    }
    else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play("right", true);
    }
    else {
        player.setVelocityX(0);
        player.anims.play("turn");
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

// производим какие нибудь действия, когда игрок касается звезды
function collectStar(player, star) {
    star.disableBody(true, true);   // отключаем физ. тело звезды, родительский объект делаем неактивным и невидимым

    score += 10;
    scoreText.setText("Score: " + score);

    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}

// производим какие нибудь действия, когда игрок касается бомбы
function hitBomb(player, bomb) {
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play("turn");
    gameOver = true;
}