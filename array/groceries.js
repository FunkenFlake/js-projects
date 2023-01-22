//Массивы.

//Создание массива и обращение к его элементу.
let groceries = ["Milk", "Eggs", "Frosted Flakes", "Salami", "Juice"];
groceries[1]

//Перебераем массив.
for (let grocerie = 0; grocerie < groceries.length; grocerie++) {
    let item = groceries[grocerie];
}

//Добавление элементов в конец массива методом push.
groceries.push("Coockies");

//Добавление элементов в начало массива методом unshift.
groceries.unshift("Banana");

//Удаление элементов с конца (pop) и начала (shift) массива.
let lastItem = groceries.pop();
let firstItem = groceries.shift();

//Поиск элементов. indexOf("Искомый элемент", индекс с которого начать поиск)
let resultIndex = groceries.indexOf("Eggs", 0);
console.log(resultIndex); // 1

//Слияние массивов (по сути конкатинация)
let good = ["Mario", "Luigi", "Kirby"];
let bad = ["Browser", "Google", "Yandex"];

let goodAndBad = good.concat(bad);
console.log(goodAndBad);

//Перебор массива через for (делаем буквы заглавными)
let names = ["marge", "homer", "bart", "lisa", "maggie"];

let newNames = [];

for (let i = 0; i < names.length; i++) {
    let name = names[i];
    let firstLetter = name.charAt(0).toUpperCase();
    newNames.push(firstLetter + name.slice(1));
}

console.log(newNames);

//Перебор массива через map.
let names_map = ["marge", "homer", "bart", "lisa", "maggie"];

function capitalizeItUp(item) {
    let firstLetter = item.charAt(0).toUpperCase();
    return firstLetter + item.slice(1);
}

let newNames_map = names.map(capitalizeItUp);
console.log(newNames_map);

//Фильтрация элементов через метод filter путем лямбды.
let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let evenNumbers = numbers.filter(function (item) {
    return (item % 2 == 0);
});

console.log(evenNumbers);

/** 
 * Анонимные функции или лямбда выражения.
 * 
 * Обычные функции, которые выполняют только одно действие
 * и тут же возвращают значение. По сути для них сразу создается
 * переменная и в нее возвращается результат действия функции.
 * Вот, простой пример с суммой двух чисел:
 * 
 * let sum = function (a, b) {
 *      return a + b;
 * };
 * console.log(sum(2, 2));
 * 
 * Вывод: 4.
 * 
 * Можно и без аргументов, чтобы просто возвращала данные.
*/

//Получение одного значения из массива методом reduce.
let numbers_reduce = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

let total_numbers_reduce = numbers_reduce.reduce(function(total, current) {
    return total + current;
}, 0);

console.log(total_numbers_reduce);

//Ещё пример, но с тремя аргументами.
let words = ["Where", "do", "you", "want", "to", "go", "today?"];

let phrase = words.reduce(function (total, current, index) {
    if (index == 0) {
        return current;
    } else {
        return total + " " + current;
    }
}, "");

console.log(phrase);