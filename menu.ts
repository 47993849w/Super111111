/**
 * Created by tomeCabello on 26/04/2016.
 */


module Joc{

    export class menu extends Phaser.State{
        tec;
        preload():void {

            super.preload();

            this.game.load.image('title1', 'assets/Sintitulo-1.png');
            this.game.load.image('k', 'assets/jet_219x219_rules02_txt.jpg');
            this.game.load.image('r', 'assets/jet_219x246_rules03_txt.jpg');
            this.game.load.image('d', 'assets/glossy-balls-hi.png');


        }

        create():void{
            super.create();

            this.game.stage.setBackgroundColor("#F4E2AB")
            //var s = this.game.add.tileSprite(0, 0, 800, 600, 'fondo');

            this.tec = this.add.sprite(this.world.centerX,this.world.centerY+100 , "k");
            this.tec = this.add.sprite(this.world.centerX-300,this.world.centerY+100 , "r");
            this.tec = this.add.sprite(this.world.centerX-300,20 , "title1");
            this.tec = this.add.sprite(this.world.centerX-120,180 , "d");
            var text = this.game.add.text(10, 240, "Presiona Espacio", {
                font: "35px Arial",
                fill: "#ffffff",
                align: "center"
            });
            var text2 = this.game.add.text(525, 240, "Presiona Espacio", {
                font: "35px Arial",
                fill: "#ffffff",
                align: "center"
            });



        }
    }
}