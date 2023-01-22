// Находим элемент по id (получаем ссылку на элемент)
let headingElement = document.querySelector("#bigMessage");
console.log(headingElement.textContent);

// Изменяем элемент
headingElement.textContent = "Oppa Gangnam Style!";
console.log(headingElement.textContent);

// Возвращение значение getAttribute.
console.log(headingElement.getAttribute("id")); //bigMessage

// Перезаписываем или устанавливаем (если нет) значение аттрибута setAttribute.
console.log(headingElement.setAttribute("class", "bar foo"));

// Другой способ установки аттрибутов только для id и class
console.log(headingElement.id); // bigMessage
headingElement.className = "bar foo";

/**
 * API для добавления и удаления классов.
 * classList, его методы:
 * add;
 * remove;
 * toggle;
 * contains.
 */

// Добавление элементов.
let divElement = document.querySelector("#myDiv");
divElement.classList.add("bar");
divElement.classList.add("baz");
divElement.classList.add("zorb");
divElement.classList.add("foo");

// Удаление элементов.
divElement.classList.remove("bar");

// Переключение значений. (если есть, то удаляем, иначе добавляем).
divElement.classList.toggle("foo"); // Удалит foo
divElement.classList.toggle("foo"); // Добавит foo
divElement.classList.toggle("foo"); // Удалит foo

// Проверка наличия значения класса
// Проверяем есть ли значение класса в элементе, если да, то возрачает true
// Если нет, то возвращает false.
if (divElement.classList.contains("bar") == true) {
    // Делает что-нибудь.
}

// Установка стиля напрямую
let myElement = document.querySelector("#superman");
myElement.style.backgroundColor = "#D93600";

// Чтобы воздействовать на несколько элементов:
let myElements = document.querySelectorAll(".bar");

for (let i = 0; i < myElements.length; i++) {
    myElements[i].style.opacity = 0;
}

// Более сложное представление значений в виде текста
myElement.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;

/**
 * Некторые св-ва CSS и JS
 * background-color = backgroundColor (в JS просто без тире)
 * float = cssfloat (в JS float зарезервированно)
 */

// Поиск пути по DOM (window, document, document.documentElement)
let windowObject = window;
let documentObject = document;
let htmlElement = document.documentElement;

// window и document глобальные св-ва. можно использовать сразу
// без объявления.

// Проверка наличия потомка
let bodyElement = document.querySelector("body");

if (bodyElement.firstChild) {
    // Делает, что-то интересное
} // Вернет null если потомков не существует

// Обращение ко всем потомкам
bodyElement = document.body;

for (let i = 0; i < bodyElement.children.length; i++) {
    let childElement = bodyElement.children[i];

    document.writeln(childElement.tagName);
}

// Прогулка по DOM
function theDOMElementWalker(node) {
    if (node.nodeType == Node.ELEMENT_NODE) {
        console.log(node.tagName);
        node = node.firstChild;

        while (node) {
            theDOMElementWalker(node);
            node = node.nextSibling;
        }
    }
}

let texasRanger = document.querySelector("#texas");
theDOMElementWalker(texasRanger);

