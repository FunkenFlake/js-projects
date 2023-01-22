//Обращение к отдельным символам.
let hiragana = "aiueo";
console.log(hiragana[2]);

//Перебор строки по индексам через for.
for (let i = 0; i < hiragana.length; i++) {//hiragana.length - длина строки.
    console.log(hiragana[i]);
}

//Возвращаем знак, согласно индексу через charAt.
//Лучше использовать этот метод, чем hiragana[2].
console.log(hiragana.charAt(2));

//Конкатенация (происходит, как и в других языках).
let katakana = "kakikukeko";
console.log(hiragana + " " + katakana);

//Конкатенация через метод concat. (лучше делать через + или += так быстрее).
let combined = hiragana.concat(" ", katakana, " tatituteto");
console.log(combined);

//Метод slice.
let theBigString = "Pulp Fiction is an awesome movie!";
console.log(theBigString.slice(5, 12));

//Метод substring, раньше был substr.
/**
 * Тут пожалуй нужно пяснение.
 * substr уже не используется (зачеркнут), он делал следующие
 * брал начальное значение и длину от него.
 * Получалось так substr(5, 7) - от 5-го индекса еще 7 индексов.
 * Получилось бы слово Fiction.
 * Новый метод substring делает другое. Берет начальное значение и длину
 * от 0-го индекса строки.
 * Вот что выходит substring(5, 7) - от 5-го индекса до 7-го индекса.
 * Получится у нас Fi, вместо желаемого Fiction.
 */
console.log(theBigString.substring(0, 4));
console.log(theBigString.substr(5, 7));
console.log(theBigString.substring(5, 12));

//Разделение строки split.
let inspirationalQuote = "That which you can concatenate, you can also split apart.";
let splitWords = inspirationalQuote.split(" ");
console.log(splitWords.length);
console.log(splitWords);

let days = "Mondey,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday";
let splitWordsNew = days.split(",");

console.log(splitWordsNew[6]);
console.log(splitWordsNew);

//Поиск по строке (indexOf, lastIndexOf, match).
let question = "I wonder what the pigs did to make these birds so angry?";
console.log(question.indexOf("to")); //27 (первый включаемый элемент)
console.log(question.indexOf("z")); //-1 (не существует).
console.log(question.lastIndexOf("wonder"));
console.log(question.lastIndexOf("the", 10));

let phrase = "There are 3 lettle pigs.";
let regexp = /[0-9]/;
let numbers = phrase.match(regexp);

console.log(numbers[0]);

let newPhrase = "My name";
