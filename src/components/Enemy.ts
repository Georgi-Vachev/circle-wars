import { Graphics, Container, Point } from "pixi.js";

export default class Enemy extends Container {
    private upperBody: Graphics;
    private movementDirection: Point;
    private speed: number;
    private changeDirectionTimer: number;

    constructor(config: any) {
        super();
        this.upperBody = new Graphics();
        this.movementDirection = new Point(0, 0);
        this.speed = config.speed || 3;
        this.changeDirectionTimer = 0;

        this.init(config);
    }

    private init(config: any) {
        this.createUpperBody(config);

        // Set initial position
        this.x = config.startX || Math.random() * window.innerWidth;
        this.y = config.startY || Math.random() * window.innerHeight;

        // Set initial random direction
        this.setRandomDirection();

        this.addChild(this.upperBody);
    }

    private createUpperBody(config: any) {
        this.upperBody.beginFill(config.bodyColor || 0xff0000, 1);
        this.upperBody.drawCircle(0, 0, config.bodyRadius || 20);
        this.upperBody.endFill();
    }

    private setRandomDirection() {
        this.movementDirection.set(Math.random() - 0.5, Math.random() - 0.5);
        this.normalizePoint(this.movementDirection);

        // Set a new timer between 0.5 and 2 seconds (in milliseconds)
        this.changeDirectionTimer = 500 + Math.random() * 1500;
    }

    private normalizePoint(point: Point) {
        const length = Math.sqrt(point.x * point.x + point.y * point.y);
        if (length > 0) {
            point.x /= length;
            point.y /= length;
        }
    }

    public update(delta: number, app: any) {
        this.changeDirectionTimer -= delta * app.ticker.elapsedMS;

        if (this.changeDirectionTimer <= 0) {
            this.setRandomDirection();
        }

        this.x += this.movementDirection.x * this.speed * delta;
        this.y += this.movementDirection.y * this.speed * delta;

        // Keep the enemy within bounds
        if (this.x < 0) this.x = 0;
        if (this.x > window.innerWidth) this.x = window.innerWidth;
        if (this.y < 0) this.y = 0;
        if (this.y > window.innerHeight) this.y = window.innerHeight;
    }

}
