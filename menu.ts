/**
 * Created by tomeCabello on 26/04/2016.
 */


module Joc{

    export class menu extends Phaser.State{
        tec;
        SpaceKey;
        

        create():void{
            super.create();

            this.game.stage.setBackgroundColor("#F4E2AB")
            //var s = this.game.add.tileSprite(0, 0, 800, 600, 'fondo');

            this.tec = this.add.sprite(this.world.centerX,this.world.centerY+80 , "k");
            this.tec = this.add.sprite(this.world.centerX-300,this.world.centerY+100 , "r");
            this.tec = this.add.sprite(this.world.centerX-300,20 , "title1");
            this.tec = this.add.sprite(this.world.centerX-120,180 , "d");
            var text = this.game.add.text(10, 240, "Presiona Espacio", {
                font: "35px Arial",
                fill: "#000099",
                align: "center"
            });
            var text2 = this.game.add.text(525, 240, "Presiona Espacio", {
                font: "35px Arial",
                fill: "#000099",
                align: "center"
            });


            this.SpaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.game.input.keyboard.addKeyCapture([Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR]);

        }
        
        update():void{
            if (this.SpaceKey.isDown) {
                this.game.state.start("game");

            }
        }
    }
}