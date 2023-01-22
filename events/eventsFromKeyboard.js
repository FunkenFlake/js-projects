// События для клавиатуры
window.addEventListener("keydown", dealWithKeyboard, false);
window.addEventListener("keydown", moveSomething, false);

function moveSomething(e) {
    switch (e.keyCode) {
        case 37:
            console.log("move left");
            break;
        case 38:
            console.log("move up");
            break;
        case 39:
            console.log("move right");
            break;
        case 40:
            console.log("move down");
            break;
    }
}

function dealWithKeyboard(e) {
    console.log(e.keyCode);
    console.log(e.metaKey);
    if (e.keyCode == 49) {
        console.log("Pressed 1 key");
    }
}

// Определение нажатия нескольких клавиш
window.addEventListener("keydown", keysPressed, false);
window.addEventListener("keyup", keysReleased, false);

let keys = [];

function keysPressed(e) {
    // Сохраняет запись о каждой нажатой клавише
    keys[e.keyCode] = true;
    console.log(keys);

    // Ctrl + Shift + 5
    if (keys[17] && keys[16] && keys[53]) {
        console.log("Ctrl + Shift + 5");
    }

    // Ctrl + f
    if (keys[17] && keys[70]) {
        console.log("Ctrl + F");

        // Предотвращает встроенное поведение браузера
        e.preventDefault();
    }
}

function keysReleased(e) {
    // Отмечает отпущенные клавиши
    keys[e.keyCode] = false;
}

// События загрузки страницы

// события DOM слушаем из document
document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);

// события load слушаем из window
window.addEventListener("load", pageFullyLoaded, false);

function theDomHasLoaded(e) {
    console.log("Dom has loaded");
}

function pageFullyLoaded(e) {
    console.log("Page has been loaded");
}

let number = Math.random() * 100;
console.log(number);

// Атрибут async позволяет сценарию выполняться асинхронно.
// <script async src="someRandomScript.js"></script>

// Атрибут defer запускает сценарии за
// несколько мгновений до срабатывания DOMContentLoaded.
// <script defer src="somethingScript.js"></script>

// Обработка событий для нескольких элементов
let theParent = document.querySelector("#theDude");
theParent.addEventListener("click", doSomthingAgain, false);

function doSomthingAgain(e) {
    if (e.target != e.currentTarget) {
        let clickedItem = e.target.id;
        console.log("Hello " + clickedItem);
    }
    e.stopPropagation();
}