/**
 * Создание объекта можно не делать через
 * new Object(), можно просто инициализировать
 * объектный литерал. Затем добавлять свойства
 * через . так получается пара ключ-значение.
 * По сути это просто, как словарь в python.
 */

//Создание объекта
let funnyGuy = {};

//Добавление свойства. Альтернатива funnyGuy["firstName"] = "Conan";
funnyGuy.firstName = "Conan";

let funnyFirstName = funnyGuy.firstName;
console.log(funnyFirstName);

funnyGuy.lastName = "O'Brien";

/**
 * Можно сделать и так, если заранее знаешь свойства
 * let funnyGuy = {
 * firstName: "Conan",
 * lastName: "O'Brain"
 * };
 */

//Объект, как свойство другого объекта
let colors = {
    header: "blue",
    footer: "gray",
    content: {
        title: "black",
        body: "darkgray",
        signature: "light blue"
    }
};

//Добавление свойства во вложенный объект (в объект в объекте)
colors.content.frame = "yellow";

//или

// colors["content"]["frame"] = "yellow";
// colors.content["frame"] = "yellow";

//Удаление св-в.
delete colors.footer;

//или

delete colors["footer"];

/**
 * delete медленный способо для множества удалений
 * в таком случае лучше использовать undifined
 */

colors.footer = undefined;

//or

colors["footer"] = undefined;

console.log(funnyGuy.toString()); // [object Object]

//Создание пользовательских объектов
let person = {
    getName: function () { //Лямбда
        return "The name is " + this.firstName + " " + this.lastName;
    },

    getInitials: function () {
        if (this.firstName && this.lastName) {
            return this.firstName[0] + this.lastName[0];
        }
    }
};

funnyGuy = Object.create(person);
funnyGuy.firstName = "Conan";
funnyGuy.lastName = "O'Brain";

let theDude = Object.create(person);
theDude.firstName = "Jeffrey";
theDude.lastName = "Lebowski";

let detective = Object.create(person);
detective.firstName = "Adrian";
detective.lastName = "Monk";

console.log(detective.getName()); // Adrian Monk
console.log(detective.getInitials()); // AM

//Ключевое слово this
//Оно просто ссылается на объект.

//Перемешка.
function shuffle(input) {
    for (let i = input.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        console.log(randomIndex);
        let itemAtIndex = input[randomIndex];
        console.log(itemAtIndex);
        console.log(input[i]);

        input[randomIndex] = input[i];
        console.log(input[randomIndex]);
        input[i] = itemAtIndex;
        console.log(input[i]);
    }
    return input;
}

let shuffleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
shuffle(shuffleArray);

console.log(shuffleArray);

let tempArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// Прикрепим shuffle() к array.prototype
Array.prototype.shuffle = function () {
    let input = this;

    for (let i = input.length - 1; i >= 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = input[randomIndex];

        input[randomIndex] = input[i];
        input[i] = itemAtIndex;
    }
    return input;
}

console.log(tempArray.shuffle());