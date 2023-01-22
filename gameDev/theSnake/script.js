// поле на котором все будет происходить, тоже переменная
let canvas = document.getElementById("game");

// двумерность
let context = canvas.getContext("2d");

// размер клетки на поле 16px
let grid = 16

// служебная переменная, отвечающая за скорость змейки
let count = 0;

// сама змейка
let snake = {
    // начальные координаты
    x: 160,
    y: 160,

    // скорость змейки  - в каждом новом кадре змейка смещается по оси Х или Y
    // на старте будет двигаться горизонтально, поэтому скорость по Y = 0
    dx: grid,
    dy: 0,

    // тащим за собой хвост, пока пустой
    cells: [],

    // стартовая длина змейки 4
    maxCells: 4
};

// еда, пусть будут красные яблоки
let apple = {
    // начальные координа яблока
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// игровой цикл, процесс внутри которого будет всё происходить
function loop() {
    // хитрая функция, которая скидывает каждый 4ый кадр игры, например было
    // 60 фпс убрав каждый 4ый , станет 15 фпс, таким образом мы замедлим игру
    requestAnimationFrame(loop);

    // игровой код выполнится только 1 раз из 4х, в этом и суть замедления кадров
    // а пока переменная count меньше 4х, код выполняться не будет
    if (++count < 4) {
        return;
    }

    // обнуляем переменную скорости
    count = 0;

    // очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);

    // двигаем змейку с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;

    // если змейка достигла края поля по горизонтали - продолжаем ее движение с противоположной стороны
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // делаем то же самое для движения по вертикали
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // продолжаем двигаться в выбранном направлении. голова всегда впереди, поэтому
    // добавляем ее координаты в начало массива, который отвечает за всю змейку.
    snake.cells.unshift({ x: snake.x, y: snake.y});

    // сразу после этого удаляем последний элемент из массива (ну так как она движется)
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // рисуем еду
    context.fillStyle = "red";
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // одно движение змейки - один новый нарисованный квадратик
    context.fillStyle = "green";

    // обрабатываем каждый элемент змейки
    snake.cells.forEach(function (cell, index) {
        // чтобы создать эффект клеточек, делаем зеленые квадраты меньше на 1px, чтобы
        // вокруг них образовалась черная граница
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // если змейка добралась до яблока
        if (cell.x === apple.x && cell.y === apple.y) {
            // увеличиваем длину змейки
            snake.maxCells++;
            // рисуем новое яблоко
            // помним, что размер холста у нас 400х400, при этом 
            // он разбит на ячейки - 25 в каждую сторону
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }
        // проверяем не столкнулась ли змея сама с собой
        // для этого перебираем весь массив и смотрим есть ли в массиве две клетки с одинаковыми координатам
        for (let i = index + 1; i < snake.cells.length; i++) {
            // если такие клетки есть, начинаем игру заного
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // задаем стартовые параметры основным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                // ставим яблочко в случайное место
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

// делаем управление, смотрим что нажимется и реагируем на это
document.addEventListener("keydown", function(e) {
    // дополнительно проверим, что если два раза нажать влево, то ничего не произойдет
    // стрелка влево
    // если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали
    if (e.which === 37 && snake.dx === 0) {
        // то даем ей движение по горизонтали, влево, а вертикальное - останавливаем
        // та же самая логика будет и в остальных кнопках
        snake.dx = -grid;
        snake.dy = 0;
    }

    // стрелка вверх
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }

    // стрелка вправо
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }

    // стрелка вниз
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);