function calculateRectangleArea(length, width) {
    return length * width;
}

let roomArea = calculateRectangleArea(10, 10);
alert(roomArea)

function youSayGoodBye() {
    alert("Bon voyage!");

    function andISayHello() {
        alert("Bonjour!");
    }

    return andISayHello;
}

let something = youSayGoodBye();
something();

function stopWatch() {
    let startTime = Date.now();

    function getDelay() {
        let elapsedTime = Date.now() - startTime;
        alert(elapsedTime);
    }

    return getDelay;
}

let timer = stopWatch();

//Сделать, что-нибудь за некоторое время.
for (let i = 0; i < 1000000; i++) {
    let foo = Math.random() * 10000;
}

//вызывать возвращаемую функцию.
timer();
