/**
 * Created by tomeCabello on 26/04/2016.
 */
module Joc {
    export class load extends Phaser.State {

        preload():void {

            super.preload();

            this.game.load.image('bullet', 'assets/sprites/purple_ball.png');
            this.game.load.image('phaser', 'assets/sprites/phaser-dude.png');
            this.game.load.spritesheet('veggies', 'assets/glossy-balls-hi.png', 78, 84);
            this.game.load.audio('blaster', 'assets/audio/SoundEffects/blaster.mp3');
            this.game.load.audio('yes', 'assets/audio/yeah.wav')
            this.game.load.audio('no', 'assets/audio/nop.wav')
            this.game.load.image('explode', 'assets/highscore.png');
        
            this.game.load.image('title1', 'assets/Sintitulo-1.png');
            this.game.load.image('k', 'assets/jet_219x219_rules02_txt.jpg');
            this.game.load.image('r', 'assets/jet_219x246_rules03_txt.jpg');
            this.game.load.image('d', 'assets/glossy-balls-hi.png');


        

            this.game.load.image('pic', 'assets/papel-pintado-liso-con-puntos-gris-y-fondo-blanco.jpg')
        }
        
        create():void{
            super.create();
            this.game.state.start("menu");
        }
    }
}