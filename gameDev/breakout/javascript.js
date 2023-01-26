
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

// добаляем единный стиль текста
var textStyle = { font: "18px Arial", fill: "#0095DD" };

// добавляем старт игры
let playing = false;
let startButton;


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
    game.load.spritesheet("ball", "img/wobble.png", 20, 20); // загрузили спрайт для анимации
    game.load.spritesheet("button", "img/button.png", 120, 40); // загрузили кнопку старта
}



// вызываете один раз, когда всё загруженно и готово
function create() {
    // инициализация физического движка
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // убираем коллизию нижней границы (для проигрыша)
    game.physics.arcade.checkCollision.down = false;

    // выводим мяч на экран
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 35, "ball"); // видимо тут у ball появляются свойства x и y

    // добавляем анимацию мячика
    ball.animations.add("wobble", [0, 1, 0, 2, 0, 1, 0, 2, 0], 25);

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
    
    // при выходе мячика за экран вызываем функцию ballLeaveScreen
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    // устанавливаем "отскакиваемость"
    ball.body.bounce.set(1);

    // теперь можно добавить значение скорости мяча (для обоих векторов) .set(значениеX, значениеY)
    // ball.body.velocity.set(170, -170); закоментили тк это переопределенно в startGame()

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
    scoreText = game.add.text(5, 5, "Points: 0", textStyle);

    // выводим кол-во жизней на экран
    livesText = game.add.text(game.world.width - 5, 5, "Lives: "+lives, textStyle);
    livesText.anchor.set(1, 0);

    // выводим текст потери жизни на экран (только, когда мы теряем жизнь)
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, "Life lost, click to continue", textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;   // lifeLostText - текст потери жизни, он появляется только, когда мы теряем жизнь, поэтому выставляем его в false

    // добавляем кнопку старта
    startButton = game.add.button(
        game.world.width * 0.5,     // координаты X кнопки
        game.world.height * 0.5,    // координаты Y кнопки
        "button",   // имя графического актива
        startGame,  // функция обратного вызова, которая будет выполняться при нажатии кнопки
        this,       // ссылка для this указания контекста выполнения
        1,          // кадр для события over (наведение мыши на кнопку)
        0,          // кадр для события out (когда убираем мышь с кнопки)
        2           // кадр для события down (когда нажимаем лкм)
    );
    startButton.anchor.set(0.5);
}



// вызывается на каждом кадре
function update() {
    // вызываем проверку коллизий между мячиком и платформой
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);   // 3ий параметр - функция, которая будет выполняться каждый раз, когда будет найдена коллизия

    // проверка коллизий между мячиком и кирпичами
    game.physics.arcade.collide(ball, bricks, ballHitBrick);    // 3ий параметр - функция, которая будет выполняться каждый раз, когда будет найдена коллизия

    // передаем управление, только когда игра началась
    if (playing) {
        // добавляем управление мышью или тачпадом или еще чем, что есть и ставим в координату мыши
        paddle.x = game.input.x || game.world.width * 0.5; // теперь каждый кадр координата Х платформы будет соответствовать координате Х курсора
        // paddle.y = game.input.y; // ахахах
    }
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
    // делаем анимацию исчезновения кирпича   
    const killTween = game.add.tween(brick.scale);  // указываем, какое св-во будет анимированно
    killTween.to({ x: 0, y: 0 }, 200, Phaser.Easing.Linear.None);   // 0 это 0%, 1 это будет 100% итп
    killTween.onComplete.addOnce(() => {    // обработчик определяющий ф-ию, которая будет выполняться по завершении анимации
        brick.kill();   // удаляем кирпич, с которым столкнулся мячик.
    }, this);
    killTween.start();  // запуск анимации

    // сокращенный синтаксис анимации.
    // game.add
    //     .tween(brick.scale)
    //     .to({ x: 2, y: 2 }, 500, Phaser.Easing.Elastic.Out, true, 100);

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

// обработка жизней
function ballLeaveScreen() {
    lives--;    // при выходе мячика за экран удаляем жизнь
    if (lives) {    // пока есть жизни
        livesText.setText("Lives: "+lives); // показываем текст жизней, с актуальными жизнями
        lifeLostText.visible = true;    // делаем видимой надпись о потере жизни
        ball.reset(game.world.width * 0.5, game.world.height - 25);     // ставим мяч в дефолтную позицию
        paddle.reset(game.world.width * 0.5, game.world.height - 5);    // ставим платформу в дефолтную позицию
        game.input.onDown.addOnce(function() {  // считываем лкм (в функции описываем действия после нажатия лкм)
            lifeLostText.visible = false;   // текст о потери жизни скрываем
            ball.body.velocity.set(150, -150);  // скорость и направление запускаем снова
        }, this);
    }
    else { // если жизни кончились
        alert("You lost, game over!");  // выводим алерт об окончании игры
        location.reload();  // перезапускаем игру
    }
}

// ф-ия проигрывает анимацию при колллизии весла и мячика
function ballHitPaddle(ball, paddle) {
    ball.animations.play("wobble");

    // изменяем скорость мяча, в зависимости от того места , где он попадет на ракетку
    ball.body.velocity.x = - 5 * (paddle.x - ball.x);
}

// ф-ия старта игры определенная в startButton
function startGame() {
    startButton.destroy();              // видимо уничтожаем кнопку
    ball.body.velocity.set(150, -150);  // ставим начальную скорость мячику
    playing = true;                     // играние ставим в true
}