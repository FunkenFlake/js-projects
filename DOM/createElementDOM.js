// Создание элементов
// let myElement = document.createElement("p");
let newElement = document.createElement("p");
let bodyElement = document.querySelector("body");
let scriptElement = document.querySelector("script");

// newElement.textContent = "Or do I exist entirely in your imagination?";

// Вставляет элемент в конец.
// bodyElement.appendChild(newElement);

// Вставка элемента перед другим элементом.
// bodyElement.insertBefore(newElement, scriptElement);

// Удаление элемента
// bodyElement.removeChild(newElement);

// Удаление без доступа к родителю.
// newElement.parentNode.removeChild(newElement);

// Удаление напрямую.
// newElement.remove();

// Клонирование элементов
bodyElement.appendChild(newElement);

let item = document.querySelector("h1");
let clonedItem = item.cloneNode(false);

bodyElement.appendChild(clonedItem);
console.log(bodyElement);

let textElement = document.querySelector(".message");

setInterval(sayWhat, 1000);

function sayWhat() {
    let clonedText = textElement.cloneNode(true);
    bodyElement.appendChild(clonedText);
}