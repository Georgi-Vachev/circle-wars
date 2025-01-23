import { Container, Graphics, Text, TextStyle } from "pixi.js";
import { createButton } from "../util"; // Adjust import path as needed

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
        this.addText();
        this.addButton();
    }

    private addBackground() {
        const bg = new Graphics();
        bg.beginFill(0x000000, 0.7);
        bg.drawRect(0, 0, this._config.screenWidth, this._config.screenHeight);
        bg.endFill();
        this.addChild(bg);
    }

    private addText() {
        const style = new TextStyle({ fill: "#ffffff", fontSize: 50 });
        const gameOverText = new Text("Game Over", style);
        gameOverText.anchor.set(0.5);
        gameOverText.x = this._config.screenWidth / 2;
        gameOverText.y = this._config.screenHeight / 2 - 50;
        this.addChild(gameOverText);
    }

    private addButton() {
        const playAgainButton = createButton({
            x: this._config.screenWidth / 2,
            y: this._config.screenHeight / 2 + 50,
            width: 110,
            height: 50,
            radius: 10,
            backgroundColor: 0x00ff00,
            label: "Play Again",
            labelStyle: { fill: "#000000", fontSize: 20 },
            onClick: () => {
                if (this.onRestart) {
                    this.onRestart();
                }
            }
        });
        this.addChild(playAgainButton);
    }
}
