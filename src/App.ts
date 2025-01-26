import { Application } from "pixi.js";
import Game from "./game/Game";
import { Stage } from "@pixi/layers";
import config from './config/config';

export default class App extends Application {
    private _game: Game;

    constructor() {
        super(config.renderer);

        this.stage = new Stage()
        this._game = this._createGame();

        document.body.appendChild(this.view as HTMLCanvasElement);

        this._resizeCanvas();
        window.addEventListener("resize", () => this._resizeCanvas());

        this.ticker.add((delta) => {
            this._game.update(delta);
        });
    }

    _createGame() {
        const game = new Game(this);

        this.stage.addChild(game);

        return game;
    }

    private _resizeCanvas() {
        const width = window.innerWidth - config.margin * 2;
        const height = window.innerHeight - config.margin * 2;

        this.renderer.resize(width, height);
        this._game.resize();

        (this.view as HTMLCanvasElement).style.position = "absolute";
        (this.view as HTMLCanvasElement).style.left = `${config.margin}px`;
        (this.view as HTMLCanvasElement).style.top = `${config.margin}px`;
    }
}