// создаем базовый класс юнитов
var Unit = new Phaser.Class({
    Extends: Phaser.GameObjects.Sprite,

    initialize:

    function Unit(scene, x, y, texture, frame, type, hp, damage) {
        Phaser.GameObjects.Sprite.call(this, scene, x, y, texture, frame)
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // урон по умолчанию
    },
    attack: function(target) {
        target.takeDamage(this.damage); 
    },
    takeDamage: function(damage) {
        this.hp -= damage;
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

    function BattleScene() {
        Phaser.Scene.call(this, {key: "BattleScene"});
    },

    create: function() {
        // меняем фон на зеленый
        this.cameras.main.setBackgroundColor("rgba(0, 200, 0, 0.5)");

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

        // добавим событие времени, которое вызовет сцену через 2 секунды
        var timeEvent = this.time.addEvent({delay: 2000, callback: this.exitBattle, callbackScope: this});

        this.sys.events.on("wake", this.wake, this);
    },

    // следующий ход (наверное)
    nextTurn: function() {
        this.index++;

        // если юнитов больше нет, то начинаем сначала с первого
        if (this.index >= this.units.length) {
            this.index = 0;
        }

        if (this.units[this.index]) {
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
        }
    },

    // передаем выбор игрока в BattleScene
    receivePlayerSelection: function(action, target) {
        if (action == "attack") {
            this.units[this.index].attack(this.enemies[target]);
        }
        this.time.addEvent({delay: 3000, callback: this.nextTurn, callbackScope: this});
    },

    // выход из сцены битвы
    exitBattle: function() {
        this.scene.sleep("UIScene");
        this.scene.switch("WorldScene");
    },
});


//UI
var UIScene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize:

    function UIScene () {
        Phaser.Scene.call(this, {key: "UIScene"});
    },

    create: function () {
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(1, 0xffffff);
        this.graphics.fillStyle(0x031f4c, 1);
        this.graphics.strokeRect(2, 150, 90, 100);
        this.graphics.fillRect(2, 150, 90, 100);
        this.graphics.strokeRect(95, 150, 90, 100);
        this.graphics.fillRect(95, 150, 90, 100);
        this.graphics.strokeRect(188, 150, 130, 100);
        this.graphics.fillRect(188, 150, 130, 100);

        // основой контейнер для хранения всех меню
        this.menus = this.add.container();

        this.heroesMenu = new HeroesMenu(195, 153, this);
        this.actionsMenu = new ActionsMenu(100, 153, this);
        this.enemiesMenu = new EnemiesMenu(8, 153, this);

        // текущее выбранное меню
        this.currentMenu = this.actionsMenu;

        //добавление меню в контейнер
        this.menus.add(this.heroesMenu);
        this.menus.add(this.actionsMenu);
        this.menus.add(this.enemiesMenu);

        // доступ к батлсцене
        this.battleScene = this.scene.get("BattleScene");

        // вызов функций меню
        this.remapHeroes();
        this.remapEnemies();

        // отслеживание нажатия клавиш
        this.input.keyboard.on("keydown", this.onKeyInput, this);

        // прослушиваем событие PlayerSelect
        this.battleScene.events.on("PlayerSelect", this.onPlayerSelect, this);

        // прослушиваем событие SelectEnemies
        this.events.on("SelectEnemies", this.onSelectEnemies, this);

        // прослушиваем событие Enemy
        this.events.on("Enemy", this.onEnemy, this);

        // начинаем первый ход с метода создания UIScene, таким образом подготовив обе сцены перед боем
        this.battleScene.nextTurn();

        // сообщения
        this.message = new Message(this, this.battleScene.events);
        this.add.existing(this.message);
    },

    // методы вызова функции меню
    remapHeroes: function() {
        var heroes = this.battleScene.heroes;
        this.heroesMenu.remap(heroes);
    },
    remapEnemies: function() {
        var enemies = this.battleScene.enemies;
        this.enemiesMenu.remap(enemies);
    },

    // обработка нажатий клавиш
    onKeyInput: function(event) {
        if (this.currentMenu) {
            if (event.code === "ArrowUp") {
                this.currentMenu.moveSelectionUp();
            } else if (event.code === "ArrowDown") {
                this.currentMenu.moveSelectionDown();
            } else if (event.code === "ArrowRight" || event.code === "Shift") {

            } else if (event.code === "Space" || event.code === "ArrowLeft") {
                this.currentMenu.confirm();
            }
        }
    },

    // активируем меню героев и выбираем первого
    onPlayerSelect: function(id) {
        this.heroesMenu.select(id);
        this.actionsMenu.select(0);
        this.currentMenu = this.actionsMenu;
    },

    // активируем меню врага и выбираем первого
    onSelectEnemies: function() {
        this.currentMenu = this.enemiesMenu;
        this.enemiesMenu.select(0);
    },

    // очистит все меню и отправит данные в BattleScene
    onEnemy: function(index) {
        this.heroesMenu.deselect();
        this.actionsMenu.deselect();
        this.enemiesMenu.deselect();
        this.currentMenu = null;
        this.battleScene.receivePlayerSelection("attack", index);
    },
});

var config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },

    scene: [BootScene, BattleScene, UIScene]
};

// MenuItem
var MenuItem = new Phaser.Class({
    Extends: Phaser.GameObjects.Text,

    initialize:

    function MenuItem(x, y, text, scene) {
        Phaser.GameObjects.Text.call(this, scene, x, y, text, {color: "#ffffff", align: "left", fontSize: 15});
    },

    select: function() {
        this.setColor("#f8ff38");
    },

    deselect: function() {
        this.setColor("#ffffff");
    }
});

// Menu
var Menu = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:

    function Menu(x, y, scene, heroes) {
        Phaser.GameObjects.Container.call(this, scene, x, y);
        this.menuItems = [];
        this.menuItemIndex = 0;
        this.heroes = heroes;
        this.x = x;
        this.y = y;
    },

    addMenuItem: function(unit) {
        var menuItem = new MenuItem(0, this.menuItems.length * 20, unit, this.scene);
        this.menuItems.push(menuItem);
        this.add(menuItem);
    },

    moveSelectionUp: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex--;
        if (this.menuItemIndex < 0)
            this.menuItemIndex = this.menuItems.length - 1;
        this.menuItems[this.menuItemIndex].select();
    },

    moveSelectionDown: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex++;
        if (this.menuItemIndex >= this.menuItems.length)
            this.menuItemIndex = 0;
        this.menuItems[this.menuItemIndex].select();
    },

    // выбрать меню целиком и элемент индекса в нем
    select: function(index) {
        if (!index)
            index = 0;
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = index;
        this.menuItems[this.menuItemIndex].select();
    },

    // отменить выбор этого меню
    deselect: function() {
        this.menuItems[this.menuItemIndex].deselect();
        this.menuItemIndex = 0;
    },

    confirm: function() {
        // what to do, when player confirm self choice
    },

    // очистка всех пунктов
    clear: function() {
        for(var i = 0; i < this.menuItems.length; i++) {
            this.menuItems[i].destroy();
        }
        this.menuItems.length = 0;
        this.menuItemIndex = 0;
    },

    // добавление новых пунктов
    remap: function(units) {
        this.clear();
        for (var i = 0; i < units.length; i++) {
            var unit = units[i];
            this.addMenuItem(unit.type);
        }
    },

});

// создаем отдельные меню
// меню героев
var HeroesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function HeroesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
    }
});

// меню действий
var ActionsMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function ActionsMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
        this.addMenuItem("Атака");
    }, 
    confirm: function() {
        // что делать, когда игрок выбирает действие
        this.scene.events.emit("SelectEnemies");    // после подтверждения вызываем SelectEnemies
    }
});

// меню врагов
var EnemiesMenu = new Phaser.Class({
    Extends: Menu,

    initialize:

    function EnemiesMenu(x, y, scene) {
        Menu.call(this, x, y, scene);
    },

    confirm: function() {
        // do something when player selects an enemy
        this.scene.events.emit("Enemy", this.menuItemIndex);
    },
});

// класс сообщений
var Message = new Phaser.Class({
    Extends: Phaser.GameObjects.Container,

    initialize:
    function Message(scene, events) {
        Phaser.GameObjects.Container.call(this, scene, 160, 30);
        var graphics = this.scene.add.graphics();
        this.add(graphics);
        graphics.lineStyle(1, 0xffffff, 0.8);
        graphics.fillStyle(0x031f4c, 0.3);
        graphics.strokeRect(-90, -15, 180, 30);
        graphics.fillRect(-90, -15, 180, 30);
        this.text = new Phaser.GameObjects.Text(scene, 0, 0, "", {color: "#ffffff", align: "center", fontSize: 13, wordWrap: {width: 160, useAdvancedWrap: true}});
        this.add(this.text);
        this.text.setOrigin(0.5);
        events.on("Message", this.showMessage, this);
        this.visible = false;
    },

    showMessage: function(text) {
        this.text.setText(text);
        this.visible = true;
        if (this.hideEvent)
            this.hideEvent.remove(false);
        this.hideEvent = this.scene.time.addEvent({delay: 2000, callback: this.hideMessage, callbackScope: this});
    },

    hideMessage: function() {
        this.hideEvent = null;
        this.visible = false;
    },
});


// запуск
var game = new Phaser.Game(config);

