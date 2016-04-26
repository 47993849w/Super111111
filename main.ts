/// <reference path="phaser/phaser.d.ts"/>
/// <reference path="joypad/GamePad.ts"/>

/*
/*PATRONS:
OBSERVER: Implementado para la puntuacion
DECORATOR: escrito, pero sin implementar. No hemos sabido acabar de implementarlo, si bien las clases necesarias estan escritas, pero no hemos acabado de saber como manadar la orden a los monstruos oara que bajemn su velocidadel bate.
STRATEGY: Implementado para bullets
FACTORY: Implemntado para monstruos
 */

module Joc {
    export class SimpleGame extends Phaser.Game {
        
        constructor() {
            super(800, 600, Phaser.AUTO, "gameDiv");
            this.state.add("game", gameState);
this.state.add("load",load);
            this.state.add("menu", menu)
            this.state.start("menu");
        }
    }
}

window.onload = () => {

    var game = new Joc.SimpleGame();
};





