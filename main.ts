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
    game.load.spritesheet('veggies', 'assets/glossy-balls-hi.png', 78, 84);
    game.load.audio('blaster', 'assets/audio/SoundEffects/blaster.mp3');
    game.load.audio('yes','assets/audio/yeah.wav')
    game.load.audio('no','assets/audio/nop.wav')

    game.load.image('pic', 'assets/papel-pintado-liso-con-puntos-gris-y-fondo-blanco.jpg')
}

//var sprite;
var bullets;
var sprite1;
var group;
var cursors;
var fireRate = 100;
var nextFire = 0;
;
var counter = 30;
var text2;
var text;
var c;
var guay;
var blaster;
var yes;
var nop;
var text3;
var sc = 0;
function create() {
    counter=30;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var s = game.add.tileSprite(0, 0, 800, 600, 'pic');

    game.stage.backgroundColor = '#F2F2F2';

    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;

    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    blaster = game.add.audio('blaster');
    yes = game.add.audio('yes');
nop=game.add.audio('no')
    

    guay = game.rnd.between(0,5);

    if (guay==0) {
         text = game.add.text(10, 10, "AZUL", {font: "65px Arial", fill: "#ff0044", align: "center"});
    }

    if (guay==1) {
         text = game.add.text(10, 10, "VERDE", {font: "65px Arial", fill: "#ff4344", align: "center"});
    }

    if (guay==2) {
         text = game.add.text(10, 10, "NARANJA", {font: "65px Arial", fill: "#ff6744", align: "center"});
    }

    if (guay==3) {
         text = game.add.text(10, 10, "LILA", {font: "65px Arial", fill: "#ff8744", align: "center"});
    }

    if (guay==4) {
         text = game.add.text(10, 10, "ROJO", {font: "65px Arial", fill: "#ff1111", align: "center"});
    }


    if (guay==5) {
         text = game.add.text(10, 10, "AMARILLO", {font: "65px Arial", fill: "#ff6744", align: "center"});
    }
    game.physics.startSystem(Phaser.Physics.ARCADE);


    text3 = game.add.text(600, 10, "Score: "+sc, {font: "40px Arial", fill: "#530545", align: "center"});


    sprite1 = game.add.sprite(400, 200, 'phaser');

     game.physics.arcade.enable(sprite1);

    group = game.add.physicsGroup(Phaser.Physics.ARCADE);


    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);


   createball();

   game.time.events.duration;

    text2 = game.add.text(game.world.centerX, game.world.centerY, 'Counter: 0', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text2.anchor.setTo(0.5, 0.5);
    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

}

function updateCounter() {

    counter--;

    text2.setText('Time: ' + counter);

}
function createball(){
    for (var i = 0; i < 6; i++)
    {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 6), 'veggies', i);

        c.body.velocity.x=game.rnd.between(40,132);
        c.body.velocity.y = game.rnd;
        c.checkWorldBounds=true;
        c.body.collideWorldBounds = true;
        game.physics.enable(c, Phaser.Physics.ARCADE);
        c.body.bounce.set(1);




    }
}


function update() {

    if (this.spaceKey.isDown){
        group.callAll('kill');
        counter=30;
        createball();
    }

    if (guay==0) {
        // text = game.add.text(10, 10, "AZUL", {font: "65px Arial", fill: "#ff0044", align: "center"});
        text.text='azul';
    }

    if (guay==1) {
         text.text="VERDE";
    }
    if (guay==2) {
         text.text= "NARANJA";
    }
    if (guay==3) {
         text.text=  "LILA";
    }
    if (guay==4) {
         text.text =  "ROJO";
    }
    if (guay==5) {
         text.text =  "AMARILLO";
    }
    if (game.physics.arcade.collide(bullets, group, collisionHandler, processHandler, this))
    {
        console.log('boom');
    }

    //bullets.checkWorldBounds=true;
    //bullets.body.collideWorldBounds = true;

    if (counter<0){
        gameOver();
    }


    /*if (counter>60){
        counter=60;
    }*/

    game.physics.arcade.collide(group, group,colision,colision, this);


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

  /*  if (cursors.up.isDown)
    {
        sprite1.body.velocity.y = -200;
    }
    else if (cursors.down.isDown)
    {
        sprite1.body.velocity.y = 200;
 }*/



    if (game.input.activePointer.isDown)
    {
        fire();
    }

}




function  gameOver(){
    text2.setText('GAME OVER')
    //game.input.onTap.addOnce(restart,this);

    group.callAll('kill');
    //create();

}
function colision(group, group1){
    group.body.bounce.set(1);
    group1.body.bounce.set(1);
}

function processHandler (player, veg) {

    return true;

}

function collisionHandler (bullet, veg) {

    if (veg.frame == guay)
    {
        veg.kill();

        guay=game.rnd.between(0,5);
        yes.play()
        counter = counter+5;

        text2.setText('Time: '+counter);
        sc++;
text3.setText('Score: '+sc);
    }

    else{
        counter=counter-5;
        text2.setText('Time: ' + counter);
nop.play();
    }

    veg.kill();
    c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', veg.frame);
    c.body.velocity.x=game.rnd.between(40,132);
    c.body.velocity.y = game.rnd;
    c.checkWorldBounds=true;
    c.body.collideWorldBounds = true;
    game.physics.enable(c, Phaser.Physics.ARCADE);
    c.body.bounce.set(1);

    game.world.callAll('revive');

    bullet.kill();

}

function fire() {

    blaster.play();

    if (game.time.now > nextFire && bullets.countDead() > 0)
    {
        nextFire = game.time.now + fireRate;

        var bullet = bullets.getFirstDead();

        bullet.reset(sprite1.x - 8, sprite1.y - 8);

        game.physics.arcade.moveToPointer(bullet, 300);
    }

}

function render() {

 ///   game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
    //.debug.spriteInfo(sprite1, 32, 450);

}