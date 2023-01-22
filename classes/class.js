// create a class.
// class Planet {

// }

//Определяем конструктор.
class Planet {
    constructor(name, radius) {
        this.name = name;
        this.radius = radius;
    }
    // Добавление функции.
    getSurfaceArea() {
        let surfaceArea = 4* Math.PI * Math.pow(this.radius, 2);
        console.log(surfaceArea + " square km!");
        return surfaceArea;
    }

    // Добавление геттеров и сеттеров.
    set gravity(value) {
        console.log("Setting value!");
        return this._gravity;
    }

    get gravity() {
        console.log("Getting value!");
        return this._gravity;
    }
}

// Расширение класса Planet классом PotatoPlanet.
class PotatoPlanet extends Planet {
    constructor(name, width, potatoType) {
        super(name, width);
        this.potatoType = potatoType;
    }

    getPotatoType() {
        let thePotato = this.potatoType.toUpperCase() + "!!1!";
        console.log(thePotato);
        return thePotato;
    }
}

// Создание объекта на основе класса и его вызов.
let myPlanet = new Planet("Earth", 6378);
console.log(myPlanet.name); //Earth

let earth = new Planet("Earth", 6378);
earth.gravity = 9.81;
earth.getSurfaceArea();

console.log(earth.gravity) //9.81

// Создание объекта PotatoPlanet.
let spudnik = new PotatoPlanet("Spudnik", 12411, "Russet");
spudnik.gravity = 42.1;
spudnik.getPotatoType();
spudnik.getSurfaceArea();

// Логические типы и строгие операторы
let sunny = true;
let traffic = false;

// Объекты boolean
let boolObject = new Boolean(false);
let anotherBool = new Boolean(true);

// Логическая функция
let bool;
// для значения false можно поместить туда:
bool = Boolean(null);
bool = Boolean(undefined);
bool = Boolean();
bool = Boolean(0);
bool = Boolean("");
bool = Boolean(false);

// Для значения true можно передать, что угодно.
bool = Boolean(true);
bool = Boolean("Hello");
bool = Boolean({});
bool = Boolean(new Boolean()); // Внедрение!

function checkBoolean(value) {
    if (value) {
        console.log("true");
    } else {
        console.log("not true");
    }
}

let someBool = Boolean(null);
checkBoolean(someBool);

// Операторы строго равенства и не равенства.
function theSolution(answer) {
    if (answer == 43) {
        console.log("You have nothing more to learn");
    }
}

theSolution("43"); // 43 передано, как строка
//true

// У строго оператора нет приведение типа
function theSolutionTwo(answer) {
    if (answer === 33) {
        console.log("You have nothing more to learn");
    }
}

theSolutionTwo("33"); // 33 передано, как число
// false

// Null & Undefined

let name1 = null;

if (name1 === null) {
    name1 = "Peter Griffin";
} else {
    name1 = "No name";
}

let myVariable;
console.log(myVariable); //undefined

function doNothing() {
    // watch paint dry
    return;
}

let weekendPlans = doNothing();
console.log(weekendPlans); // undefined

let person = {
    firstName: "Isaak",
    lastName: "Newton"
}

console.log(person.title); // undefined

// Проверка на undefined
if (typeof myVariable === "undefined") {
    console.log("Define me!");
}

// JSON
let exampleJSON = {
    "firstName": "Artem",
    "lastName": "Turov",
    "special": {
        "admin": true,
        "userID": 203
    },
    "devices": [
        {
            "type": "laptop",
            "model": "Macbook Pro"
        },
        {
            "type": "phone",
            "model": "iPhone XS"
        }
    ]
};

exampleJSON.firstName;
exampleJSON.special.userID;
console.log(exampleJSON.devices[0].model);

/**
 * Парсинг JSON
 * по сути просто преобразование всяких JSON объектов
 * в нормальный рабочий вид, вот пример:
 * function processRequest(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let response = JSON.parse(xhr.responseText);
        selectInitialState(response.region);
    }
}
 */

// querySelector поиск селектора (возвращает первый найденный элемент).
let element = document.querySelector("CSS selector");
element = document.querySelector("#main");
element = document.querySelector(".pictureContainer");

// querySelectorAll возвращает все найденные элементы (массивом)
let elements = document.querySelectorAll("CSS selector");

// Например есть куча селекторов .theImage
let images = document.querySelectorAll(".theImage");

for (let i = 0; i < images.length; i++) {
    let image = images[i];
    console.log(image.getAttribute("src")); //Считывает значение html атрибута
}

