import { Container, Graphics, Text, TextStyle } from "pixi.js";
import gsap from "gsap";

interface GameOverConfig {
    screenWidth: number;
    screenHeight: number;
}

type OnRestart = () => void;

export default class GameOverScreen extends Container {
    private _config: GameOverConfig;
    private onRestart: OnRestart;

    constructor(onRestart: OnRestart, config: GameOverConfig) {
        super();
        this._config = config;
        this.onRestart = onRestart;
        this.addBackground();
        this.addButton();
    }

    private addBackground() {
        const bg = new Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRect(0, 0, this._config.screenWidth, this._config.screenHeight);
        bg.endFill();
        this.addChild(bg);
    }

    private addButton() {
        const style = new TextStyle({ fill: "#ffffff", fontSize: 50 });
        const gameOverText = new Text("Game Over", style);
        gameOverText.anchor.set(0.5);
        gameOverText.x = this._config.screenWidth / 2;
        gameOverText.y = this._config.screenHeight / 2 - 50;
        this.addChild(gameOverText);

        const button = new Graphics();
        button.beginFill(0x00ff00);
        button.drawRect(-50, -25, 100, 50);
        button.endFill();
        button.x = this._config.screenWidth / 2;
        button.y = this._config.screenHeight / 2 + 50;
        button.interactive = true;
        button.cursor = "pointer";
        this.addChild(button);

        const buttonTextStyle = new TextStyle({ fill: "#000000", fontSize: 20 });
        const buttonText = new Text("Play Again", buttonTextStyle);
        buttonText.anchor.set(0.5);
        buttonText.x = this._config.screenWidth / 2;
        buttonText.y = this._config.screenHeight / 2 + 50;
        this.addChild(buttonText);

        button.on("pointerdown", () => {
            if (this.onRestart) {
                this.onRestart();
            }
        });
    }
}
