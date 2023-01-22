
// Прослушивание и реагирование на событие.
document.addEventListener("click", changeColor, false);

function changeColor() {
    document.body.style.backgroundColor = "#FFC942";
}

// Удаление прослушивателя событий.
document.removeEventListener("click", changeColor, false);

// Прерывание событий.
// function handleClick(e) {
//     e.stopPropagation();
//     //что нибудь делает
// }

let theElement = document.querySelector("#three_a");
theElement.addEventListener("click", doSomthing, true);

function doSomthing(e) {
    e.stopPropagation();
}