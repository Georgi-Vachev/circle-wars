import { Application, Container } from "pixi.js";

export default class SlotBG extends Container {
    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }
}