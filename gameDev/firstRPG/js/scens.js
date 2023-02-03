// создаем базовый класс юнитов
var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // урон по умолчанию
        this.living = true;
        this.menuItem = null;
    },

    // используем эту ф-ию, чтобы установить пункт меню, когда юнит умирает
    setMenuItem: function() {
        this.menuItem = item;
    },

    // атака целевого юнита
    attack: function(target) {
        if(target.living) {
            target.takeDamage(this.damage);
            this.scene.events.emit("Message", this.type + " атакует " + target.type + " с " + this.damage + " уроном");
        }
         
    },
    takeDamage: function(damage) {
        this.hp -= damage;
        if (this.hp <= 0) {
            this.hp = 0;
            this.menuItem.unitKelled();
            this.living = false;
            this.visible = false;
            this.menuItem = null;
        }
    }
});

// создаем юнит врага
var Enemy = new Phaser.Class({
    Extends: Unit,

    initialize:

    function Enemy(scene, x, y, texture, frame, type, hp, damage) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
    }
});

// создаем юнит игрока
var PlayerCharacter = new Phaser.Class({
    Extends: Unit,

    initialize:
    function PlayerCharacter(scene, x, y, texture, frame, type, hp, damage) {
        Unit.call(this, scene, x, y, texture, frame, type, hp, damage);
        // зеркально развернем изображение, чтобы не делает это руками
        this.flipX = true;

        this.setScale(2);
    }
});


// Сцены

// BATTLE
var BattleScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function BattleScene () {
        Phaser.Scene.call(this, { key: 'BattleScene' });
    },

    create: function () {
        // // меняем фон на зеленый
        this.cameras.main.setBackgroundColor('rgba(0, 200, 0, 0.5)');
        // // Одновременно запускаем сцену UI Scene
        this.scene.run('UIScene');

        // персонаж игрока - warrior
        var warrior = new PlayerCharacter(this, 250, 50, "player", 1, "Воин", 100, 20);
        this.add.existing(warrior);

        // персонаж игрока - mage
        var mage = new PlayerCharacter(this, 250, 100, "player", 4, "Маг", 80, 8);
        this.add.existing(mage);

        // дракон синий
        var dragonblue = new Enemy(this, 50, 50, "dragonblue", null, "Дракон", 50, 3);
        this.add.existing(dragonblue);

        // дракон оранжевый
        var dragonOrange = new Enemy(this, 50, 100, "dragonorange", null, "Дракон2", 50, 3);
        this.add.existing(dragonOrange);

        // массив с героями
        this.heroes = [warrior, mage];

        // массив с врагами
        this.enemies = [dragonblue, dragonOrange];

        // массив с обеими сторонами, которые будут атаковать
        this.units = this.heroes.concat(this.enemies);

        // одновременно запускаем сцену UI Scene
        this.scene.launch("UIScene");

        // сохраним индекс активного юнита, если игрок - ждем ввода пользователя, если враг - нападаем.
        this.index = -1;

        // вызываем exitBattle через 2 секунды после входв в сцену BattleScene
        var timeEvent = this.time.addEvent({delay: 2000, callback: this.exitBattle, callbackScope: this});

        this.sys.events.on("wake", this.wake, this);
    },

    // следующий ход (наверное)
    nextTurn: function() {
        // проверим на победу или проигрыш
        if (this.checkEndBattle()) {
            this.checkEndBattle();
            return;
        }

        this.index++;

        // если юнитов больше нет, то начинаем сначала с первого
        if (this.index >= this.units.length) {
            this.index = 0;
        } while(!this.units[this.index].living);

        // если это герой игрока
        if (this.units[this.index] instanceof PlayerCharacter) {
            this.events.emit("PlayerSelect", this.index);
        } else { // иначе если это юнит врага
            // выбираем случайного героя
            var r = Math.floor(Math.random() * this.heroes.length);
            // и вызываем функцию атаки юнита врага
            this.units[this.index].attack(this.heroes[r]);
            // добавляем задержку на следующий ход, чтобы был плавный игровой процесс
            this.time.addEvent({ delay: 3000, callback: this.nextTurn, callbackScope: this});
            }
        },

    // проверка для окончания боя
    checkEndBattle: function() {
        var victory = true;
        // если все враги умерли - мы победили
        for (var i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i].living)
                victory = false;
        }
        var gameOver = true;
        // если все герои умерли - мы проиграли
        for (var i = 0; i < this.heroes.length; i++) {
            if (this.heroes[i].living)
                gemaOver = false;
        }
        return victory || gameOver;
    },

    // конец боя
    endBattle: function() {
        // очищаем состояния, удаляем спрайты
        this.heroes.length = 0;
        this.enemies.length = 0;
        for (var i = 0; i < this.units.length; i++ ) {
            // ссылки на экземпляры юнитов
            this.units[i].destroy();
        }
        this.units.length = 0;

        // скрываем UI
        this.scene.sleep("UIScene");

        // возвращаемся в WorldScene и скрываем BattleScene
        this.scene.switch("WorldScene");
    },

    // передаем выбор игрока в BattleScene
    receivePlayerSelection: function(action, target) {
        if (action == "attack") {
            this.units[this.index].attack(this.enemies[target]);
        }
        this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
    },

    exitBattle: function() {
        this.scene.sleep("UIScene");
        this.scene.switch("WorldScene");
    },

    wake: function() {
        this.scene.run("UIScene");
        this.time.addEvent({delay: 2000, callback: this.exitBattle, callbackScope: this});
    }
});
 
var UIScene = new Phaser.Class({
 
    Extends: Phaser.Scene,
 
    initialize:
 
    function UIScene ()
    {
        Phaser.Scene.call(this, { key: 'UIScene' });
    },
 
    create: function ()
    {       
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);        
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);
    }
});