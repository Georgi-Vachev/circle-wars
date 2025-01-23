import { Container, Text, TextStyle, Graphics, Application } from "pixi.js";
import { createButton } from "../util";

export default class UI extends Container {
    static readonly BONUS_GAME_COUNT_DOWN = 3;

    private scoreText: Text;
    private timerText: Text;
    private bonusButton: Container;
    private score = 0;
    private remainingTime: number;
    private app: Application;

    constructor(app: Application) {
        super();

        this.remainingTime = UI.BONUS_GAME_COUNT_DOWN;
        this.app = app

        this.scoreText = new Text("Score: 0", new TextStyle({ fill: "#FFFFFF", fontSize: 24 }));
        this.timerText = new Text(`Bonus Game in ${this.remainingTime}s`, new TextStyle({ fill: "#FFFFFF", fontSize: 24 }));
        this.bonusButton = createButton({
            x: 100,
            y: 35,
            width: 180,
            height: 50,
            radius: 10,
            backgroundColor: 0x55beaa,
            label: "Start Bonus Game!",
            labelStyle: { fill: "#000000", fontSize: 18 },
            onClick: () => {
                console.log("Bonus Game Started!");
            }
        });

        this.bonusButton.visible = false;
        this.scoreText.anchor.set(1, 0);
        this.scoreText.x = this.app.renderer.width + this.scoreText.width / 2 - 10;
        this.scoreText.y = 10;

        this.timerText.x = 10;
        this.timerText.y = 10;

        this.addChild(this.scoreText);
        this.addChild(this.timerText);
        this.addChild(this.bonusButton);
    }

    public update(deltaSeconds: number) {
        if (!this.bonusButton.visible) {
            this.remainingTime -= deltaSeconds;
            if (this.remainingTime <= 0) {
                this.remainingTime = 0;
                this.activateBonusButton();
            } else {
                const displayTime = Math.ceil(this.remainingTime);
                this.timerText.text = `Bonus Game in ${displayTime}s`;
            }
        }
    }

    public addScore(amount: number) {
        this.score += amount;
        this.scoreText.text = `Score: ${this.score}`;
    }

    public reset() {
        this.score = 0;
        this.scoreText.text = `Score: ${this.score}`;
        this.remainingTime = UI.BONUS_GAME_COUNT_DOWN;
        this.timerText.text = `Bonus Game in ${this.remainingTime}s`;
        this.bonusButton.visible = false;
        this.timerText.visible = true;
    }

    private activateBonusButton() {
        this.bonusButton.visible = true;
        this.timerText.visible = false;
    }

    public resize() {
        this.scoreText.x = this.app.renderer.width - 10;
    }
}
