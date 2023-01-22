let stooges = 3;
let pi = 3.14159;
let color = 0xFF;
let massOfEarth = 5.9742e+24;

console.log(color);

let i = 4;
let j = i++ // i = 5, j = 4

i = 4;
j = ++i; // i = 5, j = 5

let leet = 0o2471; //Восьмиричные, начинаются с 0.
let leeet = 0x539; //Шестнадцатеричные, начинаются с 0x.

//Преобразование строк в число (parseInt).
let hexValue = parseInt('FFFFFF', 16);
let octalValue = parseInt('011', 8);

//Infinity и NaN
let myLoveForYou = Infinity * 2;
let nope = 1920 / "blah"; //Вернет Nan

//Округления
Math.floor(.5); //0
Math.ceil(.5); //1
Math.round(.5); //1

Math.round(3.14159 * 10) / 10; // 3.1
Math.round(3.14159 * 100) / 100; // 3.14
Math.round(3.14159 * 1000) / 1000; // 3.142
Math.round(3.14159 * 10000) / 10000; // 3.1416

Math.cos(0); // 1
Math.tan(Math.PI / 4); // 1

Math.pow(2, 4) //эквивалент 2^4(или 2 * 2 * 2 * 2)
Math.sqrt(16) // 4
Math.exp(3); //эквивалент Math.E^3

//Получение абсолютного значения
Math.abs(37); // 37
Math.abs(-6); // 6

let randomNumber = Math.random() * 100;
console.log(Math.ceil(randomNumber));
