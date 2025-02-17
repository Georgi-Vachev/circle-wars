import { Application, Container, Graphics, Renderer, Sprite, Texture } from "pixi.js";
import { createButton, createCircleSpriteWithText } from "../../util";
import Game, { EVENTS } from "../Game";

export default class SlotBG extends Container {
    private app: Application;
    private reels: Container[] = [];
    private symbols: Sprite[][] = [];
    private sprites: { [key: string]: Sprite } = {};
    private reelsArea?: Container;
    private reelAreaMask?: Graphics;
    private spinButton?: Container;
    private collectButton?: Container;
    private closeButton?: Container;
    private spinDuration = 2000;
    private symbolHeight: number = 0;

    constructor(app: Application) {
        super();

        this.app = app;

        this.init();
    }

    private init() {
        this.populateSprites();
        this.createReelsArea();
        this.createReels();
        this.createButtons();
    }

    private populateSprites() {
        for (const [key, value] of Object.entries(Game.config.powerUps)) {
            this.sprites[key] = createCircleSpriteWithText(
                this.app.renderer as Renderer,
                value.text,
                40,
                value.color,
                { fill: "#ffffff", fontWeight: "bold", fontSize: 16 }
            );
        }
    }

    private createReelsArea() {
        this.reelsArea = new Container();

        const size = Math.min(this.app.renderer.width / 2, this.app.renderer.height / 2);
        const reelsAreaBackground = new Graphics();
        reelsAreaBackground.beginFill(0x000000, 0.5);
        reelsAreaBackground.drawRect(0, 0, size, size);
        reelsAreaBackground.endFill();

        this.reelsArea.addChild(reelsAreaBackground);

        this.reelsArea.position.set(
            (this.app.renderer.width - this.reelsArea.width) / 2,
            (this.app.renderer.height - this.reelsArea.height) / 2
        );

        this.reelAreaMask = new Graphics();
        this.reelAreaMask.beginFill(0xffffff);
        this.reelAreaMask.drawRect(this.reelsArea.x - 2, this.reelsArea.y, size + 2, size);
        this.reelAreaMask.endFill();

        this.addChild(this.reelsArea);
    }

    private createReels() {
        if (!this.reelsArea) return;

        const reelWidth = this.reelsArea.width / 3;
        const reelHeight = this.reelsArea.height;
        this.symbolHeight = reelHeight / 3;
        const keys = Object.keys(this.sprites);

        for (let i = 0; i < 3; i++) {
            const reel = new Container();
            reel.position.set(i * reelWidth, 0);

            if (this.reelAreaMask) {
                reel.mask = this.reelAreaMask;
            }

            const reelBackground = new Graphics();
            reelBackground.beginFill(0x777777, 0.7);
            reelBackground.lineStyle(2, 0xffffff);
            reelBackground.drawRect(0, 0, reelWidth, reelHeight);
            reelBackground.endFill();
            reel.addChild(reelBackground);

            const symbols: Sprite[] = [];
            const startY = - this.symbolHeight / 2;

            for (let j = 0; j < 5; j++) {
                const randomKey = keys[Math.floor(Math.random() * keys.length)];
                const sprite = new Sprite(this.sprites[randomKey].texture);
                sprite.position.set(reelWidth / 2, startY + j * this.symbolHeight);
                sprite.anchor.set(0.5);
                reel.addChild(sprite);
                symbols.push(sprite);
            }

            this.symbols.push(symbols);
            this.reels.push(reel);
            this.reelsArea.addChild(reel);
        }
    }

    private createButtons() {
        this.spinButton = this.createButton('SPIN', this.spinReels.bind(this));
        this.collectButton = this.createButton('COLLECT', this.collect.bind(this));
        this.closeButton = this.createButton('CLOSE', this.close.bind(this));

        this.collectButton.visible = false;
        this.closeButton.visible = false;

        this.addChild(this.spinButton, this.collectButton, this.closeButton);
    }

    private createButton(text: string, callback: () => void) {
        const button = createButton({
            x: 100,
            y: 35,
            width: 180,
            height: 50,
            radius: 10,
            backgroundColor: 0x55beaa,
            label: text,
            labelStyle: { fill: "#000000", fontSize: 18 },
            onClick: () => callback()
        });

        button.position.set(
            this.app.renderer.width / 2,
            this.app.renderer.height / 2 + this.reelsArea!.height / 2 + button.height
        );

        return button;
    }

    private async spinReels() {
        this.spinButton!.visible = false;

        const reelDelays = [0, 500, 1000];
        const isWinning = Math.random() < 0.65;
        const winningSymbol = isWinning ? this.getRandomKey() : null;

        const spinPromises = this.reels.map((_, reelIndex) => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    this.spinSingleReel(reelIndex, this.spinDuration, winningSymbol, resolve);
                }, reelDelays[reelIndex]);
            });
        });

        await Promise.all(spinPromises);

        if (isWinning) {
            this.collectButton!.visible = true;
        } else {
            this.closeButton!.visible = true;
        }
    }

    private spinSingleReel(
        reelIndex: number,
        duration: number,
        winningSymbol: string | null,
        resolve: () => void
    ) {
        const startTime = Date.now();

        const spin = () => {
            const elapsed = Date.now() - startTime;
            const reelSymbols = this.symbols[reelIndex];

            reelSymbols.forEach((sprite, index) => {
                sprite.y += 10;
                if (sprite.y > this.reelsArea!.height) {
                    sprite.y -= this.symbolHeight * reelSymbols.length;
                    if (
                        winningSymbol &&
                        index === 2 &&
                        elapsed >= duration - this.symbolHeight * 2
                    ) {
                        console.error('winningSymbol', index, reelIndex)
                        sprite.texture = this.sprites[winningSymbol].texture;
                    } else {
                        console.error('randomSymbol', index, reelIndex)
                        sprite.texture = this.getRandomTexture();
                    }
                }
            });

            if (elapsed < duration) {
                requestAnimationFrame(spin);
            } else {
                reelSymbols.forEach((sprite, index) => {
                    sprite.y = index * this.symbolHeight - this.symbolHeight / 2;
                });

                resolve();
            }
        };

        spin();
    }


    private getRandomTexture(): Texture {
        const keys = Object.keys(this.sprites);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return this.sprites[randomKey].texture;
    }

    private getRandomKey(): string {
        const keys = Object.keys(this.sprites);
        return keys[Math.floor(Math.random() * keys.length)];
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private collect() {
        this.emit(EVENTS.END_BONUS_GAME);
    }

    private close() {
        this.emit(EVENTS.END_BONUS_GAME);
    }
}
