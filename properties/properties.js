//Свойства данных.

let foo = {
    a: "Hello",
    b: "Mondey"
}

console.log(foo.a);

foo.a = "Manic";

//Геттеры и Сеттеры
let zorb = {
    message: "Blah",

    get greeting() {
        return this.message;
    },

    set greeting(value) {
        this.message = value;
    }
};

zorb.greeting = "Hola!";
console.log(zorb.greeting);

//Генератор крика
var shout = {
    _message: "HELLO",

    get message() {
        return this._message;
    },

    set message(value) {
        this._message = value.toUpperCase();
    }
};

shout.message = "This is sparta!";
console.log(shout.message);

//Регистрация действий
var superSecureTerminal = {
    allUserNames: [],
    _username: "",

    showHistory() {
        console.log(this.allUserNames);
    },

    get username() {
        return this._username;
    },

    set username(name) {
        this._username = name;
        this.allUserNames.push(name);
    }
}

var myTerminal = Object.create(superSecureTerminal);
myTerminal.username = "Michael Gary Scott";
myTerminal.username = "Dwing K. Schrute";
myTerminal.username = "Creed Braton";
myTerminal.username = "Pam Beasley";

myTerminal.showHistory();

//Проверка значений свойства
let person = {
    _name: "",
    _age: "",

    get name() {
        return this._name;
    },

    set name(value) {
        if (value.length > 2) {
            this._name = value;
        } else {
            console.log("Name is too short");
        }
    },

    get age() {
        return this._age;
    },

    set age(value) {
        if (value < 5) {
            console.log("Too young");
        } else {
            this._age = value;
        }
    },

    get details() {
        return "Name: " + this.name + " , Age: " + this.age;
    }
}

var checkPerson = Object.create(person);

checkPerson.name = "William";
checkPerson.age = 23;

console.log(checkPerson.details);