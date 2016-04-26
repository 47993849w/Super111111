/**
 * Created by tomeCabello on 26/04/2016.
 */    

import Arcade = Phaser.Physics.Arcade;

module Joc {        

    export class gameState extends Phaser.State {
        fx;


//var this.game = new Phaser.this.game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

        preload():void {

            super.preload();

            this.game.load.image('bullet', 'assets/sprites/purple_ball.png');
            this.game.load.image('phaser', 'assets/sprites/phaser-dude.png');
            this.game.load.spritesheet('veggies', 'assets/glossy-balls-hi.png', 78, 84);
            this.game.load.audio('blaster', 'assets/audio/SoundEffects/blaster.mp3');
            this.game.load.audio('yes', 'assets/audio/yeah.wav')
            this.game.load.audio('no', 'assets/audio/nop.wav')
            this.game.load.image('explode', 'assets/highscore.png');


            this.game.load.image('pic', 'assets/papel-pintado-liso-con-puntos-gris-y-fondo-blanco.jpg')
        }

        sprite;

        bullets;

        sprite1;

        group;

        cursors;

        fireRate = 100;

        nextFire = 0;
    

        SpaceKey;
        counter = 30;

        text2;

        text;

        c;

        guay;

        blaster;

        yes;

        nop;

        text3;

        sc = 0;

        hc = 0;


        create():void {
            super.create();
            localStorage.setItem("hs", "0");
            this.counter = 30;
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            var s = this.game.add.tileSprite(0, 0, 800, 600, 'pic');

            this.game.stage.backgroundColor = '#F2F2F2';

            this.bullets = this.game.add.group();
            this.bullets.enableBody = true;
            this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

            this.bullets.createMultiple(50, 'bullet');
            this.bullets.setAll('checkWorldBounds', true);
            this.bullets.setAll('outOfBoundsKill', true);

            this.blaster = this.game.add.audio('blaster');
            this.yes = this.game.add.audio('yes');
            this.nop = this.game.add.audio('no')


            this.guay = this.game.rnd.between(0, 5);

            if (this.guay == 0) {
                this.text = this.game.add.text(10, 10, "AZUL", {
                    font: "65px Arial",
                    fill: this.generateHexColor(),
                    align: "center"
                });
            }

            if (this.guay == 1) {
                this.text = this.game.add.text(10, 10, "VERDE", {
                    font: "65px Arial",
                    fill: this.generateHexColor,
                    align: "center"
                });
            }

            if (this.guay == 2) {
                this.text = this.game.add.text(10, 10, "NARANJA", {
                    font: "65px Arial",
                    fill: this.generateHexColor(),
                    align: "center"
                });
            }

            if (this.guay == 3) {
                this.text = this.game.add.text(10, 10, "LILA", {
                    font: "65px Arial",
                    fill: this.generateHexColor(),
                    align: "center"
                });
            }

            if (this.guay == 4) {
                this.text = this.game.add.text(10, 10, "ROJO", {
                    font: "65px Arial",
                    fill: this.generateHexColor(),
                    align: "center"
                });
            }


            if (this.guay == 5) {
                this.text = this.game.add.text(10, 10, "AMARILLO", {
                    font: "65px Arial",
                    fill: this.generateHexColor(),
                    align: "center"
                });
            }
            this.game.physics.startSystem(Phaser.Physics.ARCADE);


            this.text3 = this.game.add.text(600, 10, "Score: " + this.sc, {font: "40px Arial", fill: "#530545", align: "center"});


            // Sets background color to white.


            this.sprite1 = this.game.add.sprite(400, 200, 'phaser');

            this.game.physics.arcade.enable(this.sprite1);

            this.group = this.game.add.physicsGroup(Phaser.Physics.ARCADE);


            this.SpaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);


            this.createball();

            this.game.time.events.duration;

            this.text2 = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Counter: 0', {
                font: "64px Arial",
                fill: "#ffffff",
                align: "center"
            });
            this.text2.anchor.setTo(0.5, 0.5);
            this.cursors = this.game.input.keyboard.createCursorKeys();

            this.game.time.events.loop(Phaser.Timer.SECOND, this.updateCounter, this);


        }



        fadePicture():void {


            this.game.add.tween(this.sprite).to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);

        }



        generateHexColor():String {
            return '#' + ((0.5 + 0.5 * Math.random()) * 0xFFFFFF << 0).toString(16);
        }



        updateCounter() {

            this.counter--;

            if (this.counter < 5) {
                this.text2.addColor("#ff8744", 0);
            }
            else {
                this.text2.addColor("#fffff", 0);
            }

            this.text2.setText('Time: ' + this.counter);

        }


        createball() {
            for (var i = 0; i < 6; i++) {
                var c = this.group.create(this.game.rnd.between(100, 770), this.game.rnd.between(0, 6), 'veggies', i);

                c.body.velocity.x = this.game.rnd.between(40, 132);
                c.body.velocity.y = this.game.rnd;
                c.checkWorldBounds = true;
                c.body.collideWorldBounds = true;
                this.game.physics.enable(c, Phaser.Physics.ARCADE);
                c.body.bounce.set(1);


            }
        }




        update() {


            if (this.SpaceKey.isDown) {
                this.group.callAll('kill');
                this.counter = 30;
                this.sc = 0;
                this.hc = 0;
                this.createball();
            }


            if (this.game.physics.arcade.collide(this.bullets, this.group, this.collisionHandler, this.processHandler, this)) {
                console.log('boom');
            }

            //bullets.checkWorldBounds=true;
            //bullets.body.collideWorldBounds = true;

            if (this.counter < 0) {
                this.gameOver();
            }


            if (this.counter > 60) {
                this.counter = 60;
            }

            this.game.physics.arcade.collide(this.group, this.group, this.colision, this.colision, this);


            // this.game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);

            this.sprite1.body.velocity.x = 0;
            this.sprite1.body.velocity.y = 0;

            if (this.cursors.left.isDown) {
                this.sprite1.body.velocity.x = -200;
            }
            else if (this.cursors.right.isDown) {
                this.sprite1.body.velocity.x = 200;
            }

            /*  if (cursors.up.isDown)
             {
             sprite1.body.velocity.y = -200;
             }
             else if (cursors.down.isDown)
             {
             sprite1.body.velocity.y = 200;
             }*/


            if (this.game.input.activePointer.isDown) {
                this.fire();
            }

        }




        gameOver() {
            this.text2.setText('this.game OVER')
            //this.game.input.onTap.addOnce(restart,this);


            if (this.sc > parseInt(localStorage.getItem("hs"))) {
                console.log()
                localStorage.setItem("hs", this.sc.toString());
            }


            this.group.callAll('kill');
            //create();

        }


        colision(group, group1) {
            group.body.bounce.set(1);
            group1.body.bounce.set(1);
        }



        processHandler(player, veg) {

            return true;

        }



        collisionHandler(bullet, veg) {

            if (veg.frame == this.guay) {
                veg.kill();

                this.guay = this.game.rnd.between(0, 5);
                this.yes.play()
                this.counter = this.counter + 5;

                this.text2.setText('Time: ' + this.counter);
                this.sc++;
                this.text3.setText('Score: ' + this.sc);
                if (this.guay == 0) {
                    // text = this.game.add.text(10, 10, "AZUL", {font: "65px Arial", fill: "#ff0044", align: "center"});
                    this.text.text = 'azul';
                    this.text.addColor(this.generateHexColor(), 0)
                }

                if (this.guay == 1) {
                    this.text.text = "VERDE";
                    this.text.addColor(this.generateHexColor(), 0)

                }
                if (this.guay == 2) {
                    this.text.text = "NARANJA";
                    this.text.addColor(this.generateHexColor(), 0)

                }
                if (this.guay == 3) {
                    this.text.text = "LILA";
                    this.text.addColor(this.generateHexColor(), 0)

                }
                if (this.guay == 4) {
                    this.text.text = "ROJO";
                    this.text.addColor(this.generateHexColor(), 0)

                }
                if (this.guay == 5) {
                    this.text.text = "AMARILLO";
                    this.text.addColor(this.generateHexColor(), 0)

                }
                if (this.hc == 0 && this.sc > parseInt(localStorage.getItem("hs"))) {
                    this.sprite = this.game.add.sprite(120, 100, 'explode');
                    this.game.time.events.add(Phaser.Timer.SECOND * 4, this.fadePicture, this);
                    this.hc = 1;

                }
            }

            else {
                this.counter = this.counter - 5;
                this.text2.setText('Time: ' + this.counter);
                this.nop.play();
            }

            veg.kill();
            this.c = this.group.create(this.game.rnd.between(100, 770), this.game.rnd.between(0, 570), 'veggies', veg.frame);
            this.c.body.velocity.x = this.game.rnd.between(40, 132);
            this.c.body.velocity.y = this.game.rnd;
            this.c.checkWorldBounds = true;
            this.c.body.collideWorldBounds = true;
            this.game.physics.enable(this.c, Phaser.Physics.ARCADE);
            this.c.body.bounce.set(1);

            this.game.physics.arcade.collide(veg, veg, this.colision, this.colision, this);


            //this.game.world.callAll('revive');

            bullet.kill();

        }


        fire() {

            this.blaster.play();

            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0) {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();

                bullet.reset(this.sprite1.x - 8, this.sprite1.y - 8);

                this.game.physics.arcade.moveToPointer(bullet, 300);
            }

        }



        render() {

            ///   this.game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.total, 32, 32);
            //.debug.spriteInfo(sprite1, 32, 450);

        }
    }
}