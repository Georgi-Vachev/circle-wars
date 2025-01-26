import { Application, Container, Graphics, Sprite } from "pixi.js";
import { createCircleSpriteWithText } from "../../util";

export default class SlotBG extends Container {
    private app: Application;
    private reels: Container[] = [];
    private symbols: Sprite[][] = [];
    private sprites: Sprite[] = [];
    // private reelsAreaBackground: Graphics;
    // private reelsAreaMask: Graphics;
    // private reelsArea: Container;
    // private spinButton: Graphics;
    // private collectButton: Graphics;
    // private closeButton: Graphics;

    constructor(app: Application) {
        super();

        this.app = app;

        const doubleDMG = createCircleSpriteWithText(
            'x2\nDMG',
            40,
            0xff6600,
            { fill: '#ffffff', fontWeight: 'bold', fontSize: 16 }
        );
    }
}