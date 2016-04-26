/// <reference path="phaser/phaser.d.ts"/>
/// <reference path="joypad/GamePad.ts"/>



/* */

module Joc {
    export class SimpleGame extends Phaser.Game {
        
        constructor() {
            super(800, 600, Phaser.AUTO, "gameDiv");
            this.state.add("game", gameState);
this.state.add("load",load);
            this.state.add("menu", menu)
            this.state.start("load");
        }
    }
}

window.onload = () => {

    var game = new Joc.SimpleGame();
};





