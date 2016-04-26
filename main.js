var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * Phaser joystick plugin.
 * Usage: In your preloader function call the static method preloadAssets. It will handle the preload of the necessary
 * assets. Then in the Stage in which you want to use the joystick, in the create method, instantiate the class and add such
 * object to the Phaser plugin manager (eg: this.game.plugins.add( myPlugin ))
 * Use the cursor.up / cursor.down / cursor.left / cursor.right methods to check for inputs
 * Use the speed dictionary to retrieve the input speed (if you are going to use an analog joystick)
 */
/// <reference path="../phaser/phaser.d.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (Sectors) {
        Sectors[Sectors["HALF_LEFT"] = 1] = "HALF_LEFT";
        Sectors[Sectors["HALF_TOP"] = 2] = "HALF_TOP";
        Sectors[Sectors["HALF_RIGHT"] = 3] = "HALF_RIGHT";
        Sectors[Sectors["HALF_BOTTOM"] = 4] = "HALF_BOTTOM";
        Sectors[Sectors["TOP_LEFT"] = 5] = "TOP_LEFT";
        Sectors[Sectors["TOP_RIGHT"] = 6] = "TOP_RIGHT";
        Sectors[Sectors["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
        Sectors[Sectors["BOTTOM_LEFT"] = 8] = "BOTTOM_LEFT";
        Sectors[Sectors["ALL"] = 9] = "ALL";
    })(Gamepads.Sectors || (Gamepads.Sectors = {}));
    var Sectors = Gamepads.Sectors;
    /**
     * @class Joystick
     * @extends Phaser.Plugin
     *
     * Implements a floating joystick for touch screen devices
     */
    var Joystick = (function (_super) {
        __extends(Joystick, _super);
        function Joystick(game, sector, gamepadMode) {
            if (gamepadMode === void 0) { gamepadMode = true; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.imageGroup = [];
            this.doUpdate = false;
            this.gamepadMode = true;
            this.game = game;
            this.sector = sector;
            this.gamepadMode = gamepadMode;
            this.pointer = this.game.input.pointer1;
            //Setup the images
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_base'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_segment'));
            this.imageGroup.push(this.game.add.sprite(0, 0, 'joystick_knob'));
            this.imageGroup.forEach(function (e) {
                e.anchor.set(0.5);
                e.visible = false;
                e.fixedToCamera = true;
            });
            //Setup Default Settings
            this.settings = {
                maxDistanceInPixels: 60,
                singleDirection: false,
                float: true,
                analog: true,
                topSpeed: 200
            };
            //Setup Default State
            this.cursors = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.speed = {
                x: 0,
                y: 0
            };
            this.inputEnable();
        }
        /**
         * @function inputEnable
         * enables the plugin actions
         */
        Joystick.prototype.inputEnable = function () {
            this.game.input.onDown.add(this.createStick, this);
            this.game.input.onUp.add(this.removeStick, this);
            this.active = true;
        };
        /**
         * @function inputDisable
         * disables the plugin actions
         */
        Joystick.prototype.inputDisable = function () {
            this.game.input.onDown.remove(this.createStick, this);
            this.game.input.onUp.remove(this.removeStick, this);
            this.active = false;
        };
        Joystick.prototype.inSector = function (pointer) {
            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top = pointer.position.y < this.game.height / 2;
            var half_right = pointer.position.x > this.game.width / 2;
            var half_left = pointer.position.x < this.game.width / 2;
            if (this.sector == Sectors.ALL)
                return true;
            if (this.sector == Sectors.HALF_LEFT && half_left)
                return true;
            if (this.sector == Sectors.HALF_RIGHT && half_right)
                return true;
            if (this.sector == Sectors.HALF_BOTTOM && half_bottom)
                return true;
            if (this.sector == Sectors.HALF_TOP && half_top)
                return true;
            if (this.sector == Sectors.TOP_LEFT && half_top && half_left)
                return true;
            if (this.sector == Sectors.TOP_RIGHT && half_top && half_right)
                return true;
            if (this.sector == Sectors.BOTTOM_RIGHT && half_bottom && half_right)
                return true;
            if (this.sector == Sectors.BOTTOM_LEFT && half_bottom && half_left)
                return true;
            return false;
        };
        /**
         * @function createStick
         * @param pointer
         *
         * visually creates the pad and starts accepting the inputs
         */
        Joystick.prototype.createStick = function (pointer) {
            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if (!this.inSector(pointer))
                return;
            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            this.imageGroup.forEach(function (e) {
                e.visible = true;
                e.bringToTop();
                e.cameraOffset.x = this.pointer.worldX;
                e.cameraOffset.y = this.pointer.worldY;
            }, this);
            //Allow updates on the stick while the screen is being touched
            this.doUpdate = true;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
        };
        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        Joystick.prototype.removeStick = function (pointer) {
            if (pointer.id != this.pointer.id)
                return;
            //Deny updates on the stick
            this.doUpdate = false;
            this.imageGroup.forEach(function (e) {
                e.visible = false;
            });
            this.cursors.up = false;
            this.cursors.down = false;
            this.cursors.left = false;
            this.cursors.right = false;
            this.speed.x = 0;
            this.speed.y = 0;
        };
        /**
         * @function receivingInput
         * @returns {boolean}
         *
         * Returns true if any of the joystick "contacts" is activated
         */
        Joystick.prototype.receivingInput = function () {
            return (this.cursors.up || this.cursors.down || this.cursors.left || this.cursors.right);
        };
        /**
         * @function preUpdate
         * Performs the preUpdate plugin actions
         */
        Joystick.prototype.preUpdate = function () {
            if (this.doUpdate) {
                this.setDirection();
            }
        };
        Joystick.prototype.setSingleDirection = function () {
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (d < maxDistanceInPixels) {
                this.cursors.up = false;
                this.cursors.down = false;
                this.cursors.left = false;
                this.cursors.right = false;
                this.speed.x = 0;
                this.speed.y = 0;
                this.imageGroup.forEach(function (e, i) {
                    e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                    e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                }, this);
                return;
            }
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                deltaY = 0;
                this.pointer.position.y = this.initialPoint.y;
            }
            else {
                deltaX = 0;
                this.pointer.position.x = this.initialPoint.x;
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
            this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            angle = angle * 180 / Math.PI;
            this.cursors.up = angle == -90;
            this.cursors.down = angle == 90;
            this.cursors.left = angle == 180;
            this.cursors.right = angle == 0;
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function setDirection
         * Main Plugin function. Performs the calculations and updates the sprite positions
         */
        Joystick.prototype.setDirection = function () {
            if (this.settings.singleDirection) {
                this.setSingleDirection();
                return;
            }
            var d = this.initialPoint.distance(this.pointer.position);
            var maxDistanceInPixels = this.settings.maxDistanceInPixels;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (!this.settings.analog) {
                if (d < maxDistanceInPixels) {
                    this.cursors.up = false;
                    this.cursors.down = false;
                    this.cursors.left = false;
                    this.cursors.right = false;
                    this.speed.x = 0;
                    this.speed.y = 0;
                    this.imageGroup.forEach(function (e, i) {
                        e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                        e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
                    }, this);
                    return;
                }
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            if (d > maxDistanceInPixels) {
                deltaX = Math.cos(angle) * maxDistanceInPixels;
                deltaY = Math.sin(angle) * maxDistanceInPixels;
                if (this.settings.float) {
                    this.initialPoint.x = this.pointer.x - deltaX;
                    this.initialPoint.y = this.pointer.y - deltaY;
                }
            }
            if (this.settings.analog) {
                this.speed.x = Math.round((deltaX / maxDistanceInPixels) * this.settings.topSpeed);
                this.speed.y = Math.round((deltaY / maxDistanceInPixels) * this.settings.topSpeed);
            }
            else {
                this.speed.x = Math.round(Math.cos(angle) * this.settings.topSpeed);
                this.speed.y = Math.round(Math.sin(angle) * this.settings.topSpeed);
            }
            this.cursors.up = (deltaY < 0);
            this.cursors.down = (deltaY > 0);
            this.cursors.left = (deltaX < 0);
            this.cursors.right = (deltaX > 0);
            this.imageGroup.forEach(function (e, i) {
                e.cameraOffset.x = this.initialPoint.x + (deltaX) * i / (this.imageGroup.length - 1);
                e.cameraOffset.y = this.initialPoint.y + (deltaY) * i / (this.imageGroup.length - 1);
            }, this);
        };
        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        Joystick.preloadAssets = function (game, assets_path) {
            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');
        };
        return Joystick;
    }(Phaser.Plugin));
    Gamepads.Joystick = Joystick;
})(Gamepads || (Gamepads = {}));
/// <reference path="../phaser/phaser.d.ts"/>
var Gamepads;
(function (Gamepads) {
    var PieMask = (function (_super) {
        __extends(PieMask, _super);
        function PieMask(game, radius, x, y, rotation, sides) {
            if (radius === void 0) { radius = 50; }
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (rotation === void 0) { rotation = 0; }
            if (sides === void 0) { sides = 6; }
            _super.call(this, game, x / 2, y / 2);
            this.atRest = false;
            this.game = game;
            this.radius = radius;
            this.rotation = rotation;
            this.moveTo(this.x, this.y);
            if (sides < 3)
                this.sides = 3; // 3 sides minimum
            else
                this.sides = sides;
            this.game.add.existing(this);
        }
        PieMask.prototype.drawCircleAtSelf = function () {
            this.drawCircle(this.x, this.y, this.radius * 2);
        };
        PieMask.prototype.drawWithFill = function (pj, color, alpha) {
            if (color === void 0) { color = 0; }
            if (alpha === void 0) { alpha = 1; }
            this.clear();
            this.beginFill(color, alpha);
            this.draw(pj);
            this.endFill();
        };
        PieMask.prototype.lineToRadians = function (rads, radius) {
            this.lineTo(Math.cos(rads) * radius + this.x, Math.sin(rads) * radius + this.y);
        };
        PieMask.prototype.draw = function (pj) {
            // graphics should have its beginFill function already called by now
            this.moveTo(this.x, this.y);
            var radius = this.radius;
            // Increase the length of the radius to cover the whole target
            radius /= Math.cos(1 / this.sides * Math.PI);
            // Find how many sides we have to draw
            var sidesToDraw = Math.floor(pj * this.sides);
            for (var i = 0; i <= sidesToDraw; i++)
                this.lineToRadians((i / this.sides) * (Math.PI * 2) + this.rotation, radius);
            // Draw the last fractioned side
            if (pj * this.sides != sidesToDraw)
                this.lineToRadians(pj * (Math.PI * 2) + this.rotation, radius);
        };
        return PieMask;
    }(Phaser.Graphics));
    Gamepads.PieMask = PieMask;
})(Gamepads || (Gamepads = {}));
/// <reference path="../phaser/phaser.d.ts"/>
/// <reference path="Utils.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonType) {
        ButtonType[ButtonType["SINGLE"] = 1] = "SINGLE";
        ButtonType[ButtonType["TURBO"] = 2] = "TURBO";
        ButtonType[ButtonType["DELAYED_TURBO"] = 3] = "DELAYED_TURBO";
        ButtonType[ButtonType["SINGLE_THEN_TURBO"] = 4] = "SINGLE_THEN_TURBO";
        ButtonType[ButtonType["CUSTOM"] = 5] = "CUSTOM";
    })(Gamepads.ButtonType || (Gamepads.ButtonType = {}));
    var ButtonType = Gamepads.ButtonType;
    var Button = (function (_super) {
        __extends(Button, _super);
        function Button(game, x, y, key, onPressedCallback, listenerContext, type, width, height) {
            if (type === void 0) { type = ButtonType.SINGLE_THEN_TURBO; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.pressed = false;
            this.game = game;
            this.type = type;
            this.sprite = this.game.add.sprite(x, y, key);
            this.width = width || this.sprite.width;
            this.height = height || this.sprite.height;
            this.sprite.inputEnabled = true;
            this.cooldown = {
                enabled: false,
                seconds: 0,
                timer: 0
            };
            if (onPressedCallback == undefined) {
                this.onPressedCallback = this.empty;
            }
            else {
                this.onPressedCallback = onPressedCallback.bind(listenerContext);
            }
            this.sprite.events.onInputDown.add(this.pressButton, this);
            this.sprite.events.onInputUp.add(this.releaseButton, this);
            this.sprite.anchor.setTo(1, 1);
            this.active = true;
        }
        Button.prototype.empty = function () {
        };
        Button.prototype.enableCooldown = function (seconds) {
            this.cooldown.enabled = true;
            this.cooldown.seconds = seconds;
            this.cooldown.timer = this.game.time.time;
            var mask_x = this.sprite.x - (this.sprite.width / 2);
            var mask_y = this.sprite.y - (this.sprite.height / 2);
            var mask_radius = Math.max(this.sprite.width, this.sprite.height) / 2;
            this.sprite.mask = new Gamepads.PieMask(this.game, mask_radius, mask_x, mask_y);
        };
        Button.prototype.disableCooldown = function () {
            this.cooldown.enabled = false;
            this.sprite.mask.drawCircleAtSelf();
            this.sprite.mask.atRest = true;
        };
        Button.prototype.pressButton = function () {
            switch (this.type) {
                case ButtonType.SINGLE:
                    this.onPressedCallback();
                    break;
                case ButtonType.TURBO:
                    this.pressed = true;
                    break;
                case ButtonType.DELAYED_TURBO:
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                case ButtonType.SINGLE_THEN_TURBO:
                    this.onPressedCallback();
                    this.timerId = setTimeout(function () {
                        this.pressed = true;
                    }.bind(this), 300);
                    break;
                default:
                    this.pressed = true;
            }
        };
        Button.prototype.releaseButton = function () {
            this.pressed = false;
            clearTimeout(this.timerId);
        };
        Button.prototype.setOnPressedCallback = function (listener, listenerContext) {
            this.onPressedCallback = listener.bind(listenerContext);
        };
        Button.prototype.update = function () {
            if (this.cooldown.enabled) {
                var elapsed = this.game.time.elapsedSecondsSince(this.cooldown.timer);
                var cooldown = this.cooldown.seconds;
                if (elapsed > cooldown) {
                    if (this.pressed) {
                        this.cooldown.timer = this.game.time.time;
                        if (this.type != ButtonType.CUSTOM) {
                            this.onPressedCallback();
                        }
                    }
                    if (!this.sprite.mask.atRest) {
                        this.sprite.mask.drawCircleAtSelf();
                        this.sprite.mask.atRest = true;
                    }
                    return;
                }
                var pj = elapsed / cooldown;
                this.sprite.mask.drawWithFill(pj, 0xFFFFFF, 1);
                this.sprite.mask.atRest = false;
            }
            else {
                //If it is custom, we assume the programmer will check for the state in his own update,
                //we just set the state to pressed
                if (this.pressed) {
                    this.cooldown.timer = this.game.time.time;
                    if (this.type != ButtonType.CUSTOM) {
                        this.onPressedCallback();
                    }
                }
            }
        };
        return Button;
    }(Phaser.Plugin));
    Gamepads.Button = Button;
})(Gamepads || (Gamepads = {}));
/// <reference path="Button.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (ButtonPadType) {
        ButtonPadType[ButtonPadType["ONE_FIXED"] = 1] = "ONE_FIXED";
        ButtonPadType[ButtonPadType["TWO_INLINE_X"] = 2] = "TWO_INLINE_X";
        ButtonPadType[ButtonPadType["TWO_INLINE_Y"] = 3] = "TWO_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_INLINE_X"] = 4] = "THREE_INLINE_X";
        ButtonPadType[ButtonPadType["THREE_INLINE_Y"] = 5] = "THREE_INLINE_Y";
        ButtonPadType[ButtonPadType["THREE_FAN"] = 6] = "THREE_FAN";
        ButtonPadType[ButtonPadType["FOUR_STACK"] = 7] = "FOUR_STACK";
        ButtonPadType[ButtonPadType["FOUR_INLINE_X"] = 8] = "FOUR_INLINE_X";
        ButtonPadType[ButtonPadType["FOUR_INLINE_Y"] = 9] = "FOUR_INLINE_Y";
        ButtonPadType[ButtonPadType["FOUR_FAN"] = 10] = "FOUR_FAN";
        ButtonPadType[ButtonPadType["FIVE_FAN"] = 11] = "FIVE_FAN";
    })(Gamepads.ButtonPadType || (Gamepads.ButtonPadType = {}));
    var ButtonPadType = Gamepads.ButtonPadType;
    var ButtonPad = (function (_super) {
        __extends(ButtonPad, _super);
        function ButtonPad(game, type, buttonSize) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.padding = 10;
            this.game = game;
            this.type = type;
            this.buttonSize = buttonSize;
            switch (this.type) {
                case ButtonPadType.ONE_FIXED:
                    this.initOneFixed();
                    break;
                case ButtonPadType.TWO_INLINE_X:
                    this.initTwoInlineX();
                    break;
                case ButtonPadType.THREE_INLINE_X:
                    this.initThreeInlineX();
                    break;
                case ButtonPadType.FOUR_INLINE_X:
                    this.initFourInlineX();
                    break;
                case ButtonPadType.TWO_INLINE_Y:
                    this.initTwoInlineY();
                    break;
                case ButtonPadType.THREE_INLINE_Y:
                    this.initThreeInlineY();
                    break;
                case ButtonPadType.FOUR_INLINE_Y:
                    this.initFourInlineY();
                    break;
                case ButtonPadType.FOUR_STACK:
                    this.initFourStack();
                    break;
                case ButtonPadType.THREE_FAN:
                    this.initThreeFan();
                    break;
                case ButtonPadType.FOUR_FAN:
                    this.initFourFan();
                    break;
                case ButtonPadType.FIVE_FAN:
                    this.initFiveFan();
                    break;
            }
        }
        ButtonPad.prototype.initOneFixed = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            this.game.add.plugin(this.button1);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineX = function () {
            var offsetX = this.initOneFixed();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button2);
            return offsetX;
        };
        ButtonPad.prototype.initThreeInlineX = function () {
            var offsetX = this.initTwoInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetX;
        };
        ButtonPad.prototype.initFourInlineX = function () {
            var offsetX = this.initThreeInlineX();
            var offsetY = this.game.height - this.padding;
            offsetX = offsetX - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetX;
        };
        ButtonPad.prototype.initTwoInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            return offsetY;
        };
        ButtonPad.prototype.initThreeInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initTwoInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            this.game.add.plugin(this.button3);
            return offsetY;
        };
        ButtonPad.prototype.initFourInlineY = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.initThreeInlineY();
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button4);
            return offsetY;
        };
        ButtonPad.prototype.initFourStack = function () {
            var offsetX = this.game.width - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button1 = new Gamepads.Button(this.game, offsetX, offsetY, 'button1');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button2 = new Gamepads.Button(this.game, offsetX, offsetY, 'button2');
            var offsetX = offsetX - this.buttonSize - this.padding;
            var offsetY = this.game.height - this.padding;
            this.button3 = new Gamepads.Button(this.game, offsetX, offsetY, 'button3');
            offsetY = offsetY - this.buttonSize - this.padding;
            this.button4 = new Gamepads.Button(this.game, offsetX, offsetY, 'button4');
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.toRadians = function (angle) {
            return angle * (Math.PI / 180);
        };
        ButtonPad.prototype.toDegrees = function (angle) {
            return angle * (180 / Math.PI);
        };
        ButtonPad.prototype.initThreeFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            //Button 1
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button1 = new Gamepads.Button(this.game, bx, by, 'button1');
            this.button1.sprite.scale.setTo(0.7);
            //Button 2
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
        };
        ButtonPad.prototype.initFourFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 2;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx - this.padding, cy - this.padding, 'button1');
            this.button1.sprite.scale.setTo(1.2);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
        };
        ButtonPad.prototype.initFiveFan = function () {
            //Arc Center X,Y Coordinates
            var cx = this.game.width - 3 * this.padding;
            var cy = this.game.height - 3 * this.padding;
            var radius = this.buttonSize * 1.5;
            var angleStep = 100 / 3;
            var angle = 175;
            angle = this.toRadians(angle);
            angleStep = this.toRadians(angleStep);
            this.button1 = new Gamepads.Button(this.game, cx, cy, 'button1');
            this.button1.sprite.scale.setTo(1.2);
            //Button 2
            var bx = cx + Math.cos(angle) * radius;
            var by = cy + Math.sin(angle) * radius;
            this.button2 = new Gamepads.Button(this.game, bx, by, 'button2');
            this.button2.sprite.scale.setTo(0.7);
            //Button 3
            bx = cx + Math.cos(angle + angleStep) * radius;
            by = cy + Math.sin(angle + angleStep) * radius;
            this.button3 = new Gamepads.Button(this.game, bx, by, 'button3');
            this.button3.sprite.scale.setTo(0.7);
            //Button 4
            bx = cx + Math.cos(angle + (angleStep * 2)) * radius;
            by = cy + Math.sin(angle + (angleStep * 2)) * radius;
            this.button4 = new Gamepads.Button(this.game, bx, by, 'button4');
            this.button4.sprite.scale.setTo(0.7);
            //Button 5
            bx = cx + Math.cos(angle + (angleStep * 3)) * radius;
            by = cy + Math.sin(angle + (angleStep * 3)) * radius;
            this.button5 = new Gamepads.Button(this.game, bx, by, 'button5');
            this.button5.sprite.scale.setTo(0.7);
            this.game.add.plugin(this.button1);
            this.game.add.plugin(this.button2);
            this.game.add.plugin(this.button3);
            this.game.add.plugin(this.button4);
            this.game.add.plugin(this.button5);
        };
        ButtonPad.preloadAssets = function (game, assets_path) {
            game.load.image('button1', assets_path + '/button1.png');
            game.load.image('button2', assets_path + '/button2.png');
            game.load.image('button3', assets_path + '/button3.png');
            game.load.image('button4', assets_path + '/button4.png');
            game.load.image('button5', assets_path + '/button5.png');
        };
        return ButtonPad;
    }(Phaser.Plugin));
    Gamepads.ButtonPad = ButtonPad;
})(Gamepads || (Gamepads = {}));
/// <reference path="../phaser/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (TouchInputType) {
        TouchInputType[TouchInputType["TOUCH"] = 1] = "TOUCH";
        TouchInputType[TouchInputType["SWIPE"] = 2] = "SWIPE";
    })(Gamepads.TouchInputType || (Gamepads.TouchInputType = {}));
    var TouchInputType = Gamepads.TouchInputType;
    var TouchInput = (function (_super) {
        __extends(TouchInput, _super);
        function TouchInput(game, sector, type) {
            if (type === void 0) { type = TouchInputType.SWIPE; }
            _super.call(this, game, new PIXI.DisplayObject());
            this.screenPressed = false;
            this.swipeThreshold = 100;
            this.game = game;
            this.sector = sector;
            this.touchType = type;
            this.pointer = this.game.input.pointer1;
            this.swipeDownCallback = this.empty;
            this.swipeLeftCallback = this.empty;
            this.swipeRightCallback = this.empty;
            this.swipeUpCallback = this.empty;
            this.onTouchDownCallback = this.empty;
            this.onTouchReleaseCallback = this.empty;
            //Setup Default State
            this.swipe = {
                up: false,
                down: false,
                left: false,
                right: false
            };
            this.inputEnable();
        }
        TouchInput.prototype.inputEnable = function () {
            this.game.input.onDown.add(this.startGesture, this);
            this.game.input.onUp.add(this.endGesture, this);
            this.active = true;
        };
        TouchInput.prototype.inputDisable = function () {
            this.game.input.onDown.remove(this.startGesture, this);
            this.game.input.onUp.remove(this.endGesture, this);
            this.active = false;
        };
        TouchInput.prototype.inSector = function (pointer) {
            var half_bottom = pointer.position.y > this.game.height / 2;
            var half_top = pointer.position.y < this.game.height / 2;
            var half_right = pointer.position.x > this.game.width / 2;
            var half_left = pointer.position.x < this.game.width / 2;
            if (this.sector == Gamepads.Sectors.ALL)
                return true;
            if (this.sector == Gamepads.Sectors.HALF_LEFT && half_left)
                return true;
            if (this.sector == Gamepads.Sectors.HALF_RIGHT && half_right)
                return true;
            if (this.sector == Gamepads.Sectors.HALF_BOTTOM && half_bottom)
                return true;
            if (this.sector == Gamepads.Sectors.HALF_TOP && half_top)
                return true;
            if (this.sector == Gamepads.Sectors.TOP_LEFT && half_top && half_left)
                return true;
            if (this.sector == Gamepads.Sectors.TOP_RIGHT && half_top && half_right)
                return true;
            if (this.sector == Gamepads.Sectors.BOTTOM_RIGHT && half_bottom && half_right)
                return true;
            if (this.sector == Gamepads.Sectors.BOTTOM_LEFT && half_bottom && half_left)
                return true;
            return false;
        };
        TouchInput.prototype.startGesture = function (pointer) {
            //If this joystick is not in charge of monitoring the sector that was touched --> return
            if (!this.inSector(pointer))
                return;
            this.touchTimer = this.game.time.time;
            this.screenPressed = true;
            //Else update the pointer (it may be the first touch)
            this.pointer = pointer;
            //Start the Stick on the position that is being touched right now
            this.initialPoint = this.pointer.position.clone();
            if (this.touchType == TouchInputType.TOUCH) {
                this.onTouchDownCallback();
            }
        };
        /**
         * @function removeStick
         * @param pointer
         *
         * Visually removes the stick and stops paying atention to input
         */
        TouchInput.prototype.endGesture = function (pointer) {
            if (pointer.id != this.pointer.id)
                return;
            this.screenPressed = false;
            var elapsedTime = this.game.time.elapsedSecondsSince(this.touchTimer);
            if (this.touchType == TouchInputType.TOUCH) {
                this.onTouchReleaseCallback(elapsedTime);
                return;
            }
            var d = this.initialPoint.distance(this.pointer.position);
            if (d < this.swipeThreshold)
                return;
            var deltaX = this.pointer.position.x - this.initialPoint.x;
            var deltaY = this.pointer.position.y - this.initialPoint.y;
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                this.pointer.position.y = this.initialPoint.y;
            }
            else {
                this.pointer.position.x = this.initialPoint.x;
            }
            var angle = this.initialPoint.angle(this.pointer.position);
            angle = angle * 180 / Math.PI;
            this.swipe.up = angle == -90;
            this.swipe.down = angle == 90;
            this.swipe.left = angle == 180;
            this.swipe.right = angle == 0;
            console.log(this.swipe);
            if (this.swipe.up)
                this.swipeUpCallback();
            if (this.swipe.down)
                this.swipeDownCallback();
            if (this.swipe.left)
                this.swipeLeftCallback();
            if (this.swipe.right)
                this.swipeRightCallback();
        };
        TouchInput.prototype.empty = function (par) {
        };
        /**
         * @function preloadAssets
         * @static
         * @param game {Phaser.Game} - An instance of the current Game object
         * @param assets_path {String} - A relative path to the assets directory
         *
         * Static class that preloads all the necesary assets for the joystick. Should be called on the game
         * preload method
         */
        TouchInput.preloadAssets = function (game, assets_path) {
            game.load.image('joystick_base', assets_path + '/joystick_base.png');
            game.load.image('joystick_segment', assets_path + '/joystick_segment.png');
            game.load.image('joystick_knob', assets_path + '/joystick_knob.png');
        };
        return TouchInput;
    }(Phaser.Plugin));
    Gamepads.TouchInput = TouchInput;
})(Gamepads || (Gamepads = {}));
/// <reference path="../phaser/phaser.d.ts"/>
/// <reference path="Joystick.ts"/>
/// <reference path="Button.ts"/>
/// <reference path="ButtonPad.ts"/>
/// <reference path="TouchInput.ts"/>
var Gamepads;
(function (Gamepads) {
    (function (GamepadType) {
        GamepadType[GamepadType["SINGLE_STICK"] = 1] = "SINGLE_STICK";
        GamepadType[GamepadType["DOUBLE_STICK"] = 2] = "DOUBLE_STICK";
        GamepadType[GamepadType["STICK_BUTTON"] = 3] = "STICK_BUTTON";
        GamepadType[GamepadType["CORNER_STICKS"] = 4] = "CORNER_STICKS";
        GamepadType[GamepadType["GESTURE_BUTTON"] = 5] = "GESTURE_BUTTON";
        GamepadType[GamepadType["GESTURE"] = 6] = "GESTURE";
    })(Gamepads.GamepadType || (Gamepads.GamepadType = {}));
    var GamepadType = Gamepads.GamepadType;
    var GamePad = (function (_super) {
        __extends(GamePad, _super);
        function GamePad(game, type, buttonPadType) {
            _super.call(this, game, new PIXI.DisplayObject());
            this.test = 0;
            this.game = game;
            switch (type) {
                case GamepadType.DOUBLE_STICK:
                    this.initDoublStick();
                    break;
                case GamepadType.SINGLE_STICK:
                    this.initSingleStick();
                    break;
                case GamepadType.STICK_BUTTON:
                    this.initStickButton(buttonPadType);
                    break;
                case GamepadType.CORNER_STICKS:
                    this.initCornerSticks();
                    break;
                case GamepadType.GESTURE_BUTTON:
                    this.initGestureButton(buttonPadType);
                    break;
                case GamepadType.GESTURE:
                    this.initGesture();
                    break;
            }
        }
        GamePad.prototype.initDoublStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_LEFT);
            this.stick2 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_RIGHT);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
        };
        GamePad.prototype.initCornerSticks = function () {
            //Add 2 extra pointers (2 by default + 2 Extra)
            this.game.input.addPointer();
            this.game.input.addPointer();
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.BOTTOM_LEFT);
            this.stick2 = new Gamepads.Joystick(this.game, Gamepads.Sectors.TOP_LEFT);
            this.stick3 = new Gamepads.Joystick(this.game, Gamepads.Sectors.TOP_RIGHT);
            this.stick4 = new Gamepads.Joystick(this.game, Gamepads.Sectors.BOTTOM_RIGHT);
            this.game.add.plugin(this.stick1, null);
            this.game.add.plugin(this.stick2, null);
            this.game.add.plugin(this.stick3, null);
            this.game.add.plugin(this.stick4, null);
        };
        GamePad.prototype.initSingleStick = function () {
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.ALL);
            this.game.add.plugin(this.stick1, null);
        };
        GamePad.prototype.initStickButton = function (buttonPadType) {
            this.stick1 = new Gamepads.Joystick(this.game, Gamepads.Sectors.HALF_LEFT);
            this.game.add.plugin(this.stick1, null);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        };
        GamePad.prototype.initGestureButton = function (buttonPadType) {
            this.touchInput = new Gamepads.TouchInput(this.game, Gamepads.Sectors.HALF_LEFT);
            this.buttonPad = new Gamepads.ButtonPad(this.game, buttonPadType, 100);
        };
        GamePad.prototype.initGesture = function () {
            this.touchInput = new Gamepads.TouchInput(this.game, Gamepads.Sectors.ALL);
        };
        GamePad.preloadAssets = function (game, assets_path) {
            Gamepads.Joystick.preloadAssets(game, assets_path);
            Gamepads.ButtonPad.preloadAssets(game, assets_path);
        };
        return GamePad;
    }(Phaser.Plugin));
    Gamepads.GamePad = GamePad;
})(Gamepads || (Gamepads = {}));
/// <reference path="phaser/phaser.d.ts"/>
/// <reference path="joypad/GamePad.ts"/>
/*
/*PATRONS:
OBSERVER: Implementado para la puntuacion
DECORATOR: escrito, pero sin implementar. No hemos sabido acabar de implementarlo, si bien las clases necesarias estan escritas, pero no hemos acabado de saber como manadar la orden a los monstruos oara que bajemn su velocidadel bate.
STRATEGY: Implementado para bullets
FACTORY: Implemntado para monstruos
 */
var Arcade = Phaser.Physics.Arcade;
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
    game.stage.backgroundColor = '#313130';
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(50, 'bullet');
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);
    var text = game.add.text(10, 10, "AMARILLO", { font: "65px Arial", fill: "#ff0044", align: "center" });
    i2 = 1;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#2d2d2d';
    sprite1 = game.add.sprite(32, 200, 'phaser');
    game.physics.arcade.enable(sprite1);
    group = game.add.physicsGroup(Phaser.Physics.ARCADE);
    for (var i = 0; i < 10; i++) {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', i);
        c.body.velocity.x = game.rnd.between(-40, 32);
        c.body.velocity.y = game.rnd;
        c.checkWorldBounds = true;
        c.body.collideWorldBounds = true;
        game.physics.enable(c, Phaser.Physics.ARCADE);
        c.body.bounce.set(1);
    }
    game.time.events.duration;
    cursors = game.input.keyboard.createCursorKeys();
}
function createball(group1) {
    //group1.remove();
    for (var i = 0; i < 10; i++) {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(0, 6));
        c.body.velocity.x = 45;
        ;
    }
}
function update() {
    if (game.physics.arcade.collide(bullets, group, collisionHandler, processHandler, this)) {
        console.log('boom');
    }
    game.physics.arcade.collide(group, group, colision, colision, this);
    // game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);
    sprite1.body.velocity.x = 0;
    sprite1.body.velocity.y = 0;
    if (cursors.left.isDown) {
        sprite1.body.velocity.x = -200;
    }
    else if (cursors.right.isDown) {
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
    if (game.input.activePointer.isDown) {
        fire();
    }
}
function colision(group, group1) {
    group.body.bounce.set(0.8);
}
function processHandler(player, veg) {
    return true;
}
function collisionHandler(bullet, veg) {
    if (veg.frame == i2) {
        veg.kill();
        i2 = veg.Frame;
    }
    veg.kill();
    c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', veg.frame);
    c.body.velocity.x = game.rnd.between(-40, 32);
    c.body.velocity.y = game.rnd;
    c.checkWorldBounds = true;
    c.body.collideWorldBounds = true;
    game.physics.enable(c, Phaser.Physics.ARCADE);
    c.body.bounce.set(1);
    game.world.callAll('revive');
    bullet.kill();
}
function fire() {
    if (game.time.now > nextFire && bullets.countDead() > 0) {
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
//# sourceMappingURL=main.js.map