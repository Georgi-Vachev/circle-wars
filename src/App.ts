import { Application } from "pixi.js";
import Game from "./game/Game";
import { Stage } from "@pixi/layers";

export default class App extends Application {
    private _config: any;
    private _game: Game;

    constructor(config: any) {
        super(config.renderer);

        this.stage = new Stage()
        this._config = config;
        this._game = this._createGame(config);

        document.body.appendChild(this.view as HTMLCanvasElement);

        this._resizeCanvas();
        window.addEventListener("resize", () => this._resizeCanvas());

        this.ticker.add((delta) => {
            this._game.update(delta);
        });
    }

    _createGame(config: any) {
        const game = new Game(config, this);

        this.stage.addChild(game);

        return game;
    }

    private _resizeCanvas() {
        const width = window.innerWidth - this._config.margin * 2;
        const height = window.innerHeight - this._config.margin * 2;

        this.renderer.resize(width, height);
        this._game.resize();

        (this.view as HTMLCanvasElement).style.position = "absolute";
        (this.view as HTMLCanvasElement).style.left = `${this._config.margin}px`;
        (this.view as HTMLCanvasElement).style.top = `${this._config.margin}px`;
    }
}