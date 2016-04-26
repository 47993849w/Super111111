/// <reference path="phaser/phaser.d.ts"/>
/// <reference path="joypad/GamePad.ts"/>

/*
/*PATRONS:
OBSERVER: Implementado para la puntuacion
DECORATOR: escrito, pero sin implementar. No hemos sabido acabar de implementarlo, si bien las clases necesarias estan escritas, pero no hemos acabado de saber como manadar la orden a los monstruos oara que bajemn su velocidadel bate.
STRATEGY: Implementado para bullets
FACTORY: Implemntado para monstruos
 */



import Arcade = Phaser.Physics.Arcade;

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('bullet', 'assets/sprites/purple_ball.png');
    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);
}

//var sprite;
var bullets;
var sprite1;
var group;
var cursors;
var fireRate = 100;
var nextFire = 0;
var i2;
var c;
function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#313131';

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);






    var text = game.add.text(10,10, "AMARILLO", { font: "65px Arial", fill: "#ff0044", align: "center" });
    i2=1;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(32, 200, 'phaser');

    game.physics.arcade.enable(sprite1);

    group = game.add.physicsGroup(Phaser.Physics.ARCADE);




    for (var i = 0; i < 10; i++)
    {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', i);

        c.body.velocity.x=game.rnd.between(-40,32);
        c.body.velocity.y = game.rnd;

    }

   // game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, createball, this);


    cursors = game.input.keyboard.createCursorKeys();

}


function createball(group1){
    //group1.remove();
    for (var i = 0; i < 10; i++)
    {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(0, 6));
        c.body.velocity.x=45;;
    }
}


function update() {


    if (game.physics.arcade.collide(bullets, group, collisionHandler, processHandler, this))
    {
        console.log('boom');
    }

    // game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);

    sprite1.body.velocity.x = 0;
    sprite1.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite1.body.velocity.x = -200;
    }
    else if (cursors.right.isDown)
    {
        sprite1.body.velocity.x = 200;
    }

    if (cursors.up.isDown)
    {
        sprite1.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.velocity.y = 200;
    }



    if (game.input.activePointer.isDown)
    {
        fire();
    }

}




function processHandler (player, veg) {

    return true;

}

function collisionHandler (bullet, veg) {

    if (veg.frame == i2)
    {
        veg.kill();
        group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', i2);

        i2=15;
    }

    game.world.callAll('revive');

    bullet.kill();

}

function fire() {

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(sprite1.x - 8, sprite1.y - 8);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}

function render() {

    game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    game.debug.spriteInfo(sprite1, 32, 450);

}