import GameEntity from "./GameEntity";
import { Point } from "pixi.js";

export default class Enemy extends GameEntity {
    private changeDirectionTimer: number;

    constructor(config: any, playerPosition: Point) {
        super(config);
        this.changeDirectionTimer = 0;
        this.spawnAroundCenter(playerPosition);
        this.setRandomDirection();
    }

    private spawnAroundCenter(appCenter: Point) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomRadius = this.config.minSpawnRadius + Math.random() * (this.config.maxSpawnRadius - this.config.minSpawnRadius);

        this.x = appCenter.x + Math.cos(randomAngle) * randomRadius;
        this.y = appCenter.y + Math.sin(randomAngle) * randomRadius;
    }


    public update(delta: number, app: any, playerPosition: Point) {
        this.changeDirectionTimer -= delta * app.ticker.elapsedMS;

        if (this.changeDirectionTimer <= 0) {
            this.setRandomDirection();
        }

        this.updatePosition(delta);
        this.updateLowerBodyRotation();
        this.updateUpperBodyRotation(playerPosition);
        this.updateLegSwing();
    }

    private setRandomDirection() {
        this.movementDirection.set(Math.random() - 0.5, Math.random() - 0.5);
        this.normalizePoint(this.movementDirection);

        this.changeDirectionTimer = 500 + Math.random() * 1000;
    }

    private updateUpperBodyRotation(playerPosition: Point) {
        const dx = playerPosition.x - this.x;
        const dy = playerPosition.y - this.y;
        this.upperBody.rotation = Math.atan2(dy, dx) + Math.PI / 2;
    }

    private updateLowerBodyRotation() {
        const angle = Math.atan2(this.movementDirection.y, this.movementDirection.x);
        this.lowerBody.rotation = angle + Math.PI / 2;
    }

    private updatePosition(delta: number) {
        this.x += this.movementDirection.x * this.speed * delta;
        this.y += this.movementDirection.y * this.speed * delta;

        if (this.x <= 0 || this.x >= window.innerWidth - this.upperBody.width) {
            this.movementDirection.x *= -1;
            this.x = Math.max(100, Math.min(window.innerWidth - this.upperBody.width, this.x));
        }

        if (this.y <= 0 || this.y >= window.innerHeight - this.upperBody.height) {
            this.movementDirection.y *= -1;
            this.y = Math.max(0, Math.min(window.innerHeight - this.upperBody.height, this.y));
        }
    }
}
