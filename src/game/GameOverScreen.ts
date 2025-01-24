import { Application, Container, Graphics, Text, TextStyle } from "pixi.js";
import { createButton } from "../util";

type OnRestart = () => void;

export default class GameOverScreen extends Container {
    private app: Application;
    private overlay?: Graphics;
    private gameOverText?: Text;
    private playAgainButton?: Container;
    private onRestart: OnRestart;

    constructor(app: Application, onRestart: OnRestart) {
        super();
        this.app = app
        this.onRestart = onRestart;
        this.addBackground();
        this.addText();
        this.addButton();
    }

    public resize() {
        if (this.overlay) {
            this.overlay.clear();
            this.overlay.beginFill(0x000000, 0.7);
            this.overlay.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height);
            this.overlay.endFill();
        }

        if (this.gameOverText) {
            this.gameOverText.x = this.app.renderer.width / 2;
            this.gameOverText.y = this.app.renderer.height / 2 - 50;
        }

        this.playAgainButton?.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2 + 50);
    }

    private addBackground() {
        this.overlay = new Graphics();
        this.overlay.beginFill(0x000000, 0.7);
        this.overlay.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height);
        this.overlay.endFill();
        this.addChild(this.overlay);
    }

    private addText() {
        const style = new TextStyle({ fill: "#ffffff", fontSize: 50 });
        this.gameOverText = new Text("Game Over", style);
        this.gameOverText.anchor.set(0.5);
        this.gameOverText.x = this.app.renderer.width / 2;
        this.gameOverText.y = this.app.renderer.height / 2 - 50;
        this.addChild(this.gameOverText);
    }

    private addButton() {
        this.playAgainButton = createButton({
            x: this.app.renderer.width / 2,
            y: this.app.renderer.height / 2 + 50,
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

        this.playAgainButton.position.set(this.app.renderer.width / 2, this.app.renderer.height / 2 + 50);
        this.addChild(this.playAgainButton);
    }
}
