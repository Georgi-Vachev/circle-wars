import { Application, Container } from "pixi.js";

export default class TargetPracticeBG extends Container {
    private app: Application;

    constructor(app: Application) {
        super();

        this.app = app;
    }
}