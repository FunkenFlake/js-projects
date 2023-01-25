
// настройки макета игры
var game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
});

// добавляем мяч
var ball;

// добавляем весло (платформу)
var paddle;

// добавляем кирпичи
var bricks;
var newBrick;
var brickInfo;

// добавляем очки
var scoreText;
var score = 0;

// добавляем жизни
var lives = 3;
var livesText;
var lifeLostText;


// функция для предзагрузки ресурсов игры
function preload() {
    // масштабирование
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // масштабирует игру, но сохраняет соотношения
    game.scale.pageAlignHorizontally = true; // горизонтальное выравнивание элемента
    game.scale.pageAlignVertically = true; // вертикальное выравнивание элемента
    game.stage.backgroundColor = "#eee"; // изменение цвета фона

    // подгружаем спрайты
    game.load.image("ball", "img/ball.png"); // загрузили мячик
    game.load.image("paddle", "img/paddle.png"); // загрузили весло (платформу)
    game.load.image("brick", "img/brick.png"); // загрузили кирпич
}



// вызываете один раз, когда всё загруженно и готово
function create() {
    // инициализация физического движка
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // убираем коллизию нижней границы (для проигрыша)
    game.physics.arcade.checkCollision.down = false;

    // выводим мяч на экран
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 35, "ball"); // видимо тут у ball появляются свойства x и y

    // выводим платформу на экран
    paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, "paddle");

    // ставим якорь по центру платформы и мяч туда же (по умолчанию он в верхнем левом углу)
    paddle.anchor.set(0.5, 1);
    ball.anchor.set(0.5);

    // добавляем мяч и платформу в физическую систему
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);

    // устанавливаем коллизию стен (рассматриваем границы элемента <canvas> как стены)
    ball.body.collideWorldBounds = true;

    // перехватываем момент выхода мячика за нижнюю (в нашем случае, тк она отключена) границу
    ball.checkWorldBounds = true;
    
    // выводим сообщение о проигрыше и перезапуск игры делаем
    ball.events.onOutOfBounds.add(function() {
        alert("Game over!");
        location.reload();
    }, this);

    // устанавливаем "отскакиваемость"
    ball.body.bounce.set(1);

    // теперь можно добавить значение скорости мяча (для обоих векторов) .set(значениеX, значениеY)
    ball.body.velocity.set(170, -170);

    // гравитация, устанавливаем только для определенного вектора (например для y) .y = значение
    // ball.body.gravity.y = 1200;
    // ball.body.gravity.x = 1200;

    // трение
    ball.body.friction.set(100, 100);

    // делаем платформу недвижИмой
    paddle.body.immovable = true;

    // вызываем функцию отрисовки кирпичей
    initBricks();

    // выводим очки на экран
    scoreText = game.add.text(5, 5, "Points: 0", {font: "18px Arial", fill: "#0095DD"});
}



// вызывается на каждом кадре
function update() {
    // вызываем проверку коллизий между мячиком и платформой
    game.physics.arcade.collide(ball, paddle);

    // проверка коллизий между мячиком и кирпичами
    game.physics.arcade.collide(ball, bricks, ballHitBrick);    // 3ий параметр - функция, которая будет выполняться каждый раз, когда будет найдена коллизия

    // добавляем управление мышью или тачпадом или еще чем, что есть и ставим в координату мыши
    paddle.x = game.input.x || game.world.width * 0.5; // теперь каждый кадр координата Х платформы будет соответствовать координате Х курсора
    // paddle.y = game.input.y; // ахахах

}


// функция для инициализации (отрисовки) кирпичей
function initBricks() {
    brickInfo = {
        width: 50,      // ширина
        height: 20,     // высота
        count: {        // общее кол-во
            row: 3,     // ряды
            col: 7      // столбцы
        },
        offset: {       // отступы
            top: 50,    // от верхнего края экрана
            left: 60    // от левого края экрана
        },
        padding: 10     // зазоры между кирпичами
    }

    // инициализация пустого набора для хранения кирпичей
    bricks = game.add.group();

    // перебор рядов и столбцов
    for (c = 0; c < brickInfo.count.col; c++) {
        for (r = 0; r < brickInfo.count.row; r++) {
            // создаем новый блок и добавляем в группу
            var brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left; // координата Х для кирпича (в которой он будет нарисован)
            var brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top; // координата Y для кирпича (в которой он будет нарисован)
            newBrick = game.add.sprite(brickX, brickY, "brick"); // выводим кирпич на экран в координатах brickX, brickY
            game.physics.enable(newBrick, Phaser.Physics.ARCADE); // включаем физику для кирпича
            newBrick.body.immovable = true; // делаем его недвежИмым
            newBrick.anchor.set(0.5); // ставим якорь на центр
            bricks.add(newBrick); // добавляем в группу кирпичей наш новый кирпич
        }
    }
}


// проверяем была ли коллизия у мячика и кирпича , если да - удаляем кирпич
function ballHitBrick(ball, brick) {
    brick.kill();   // удаляем кирпич, с которым столкнулся мячик.

    // добавляем очки, при ломании кирпича
    score += 10;

    // обновляем текст вызовом ф-ии setText()
    scoreText.setText("Points: "+score);

    // код победы (вот тут чет не понятно)
    var count_alive = 0;
    for (i = 0; i < bricks.children.length; i++) {
        if (bricks.children[i].alive == true) {
            count_alive++;
        }
    }

    if (count_alive == 0) {
        alert("You won the game, congratulations!");
        location.reload();
    }
}