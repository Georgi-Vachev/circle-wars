import GameEntity from "./GameEntity";
import { Application, Graphics, Point } from "pixi.js";
import { Projectile } from "./ProjectileManager";

export default class Enemy extends GameEntity {
    protected changeDirectionTimer: number;
    private app: Application;

    constructor(app: Application, config: any, playerPosition: Point) {
        super(config);

        this.app = app;
        this.changeDirectionTimer = 0;
        this.spawnAroundCenter(playerPosition);
        this.setRandomDirection();
    }

    protected spawnAroundCenter(appCenter: Point) {
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

        if (this.x <= 0 || this.x >= this.app.renderer.width - this.upperBody.width) {
            this.movementDirection.x *= -1;
            this.x = Math.max(0, Math.min(this.app.renderer.width - this.upperBody.width, this.x));
        }

        if (this.y <= 0 || this.y >= this.app.renderer.height - this.upperBody.height) {
            this.movementDirection.y *= -1;
            this.y = Math.max(0, Math.min(this.app.renderer.height - this.upperBody.height, this.y));
        }
    }

    public shootAt(targetPosition: Point): Projectile | null {
        if (!this.config.canShoot) {
            return null;
        }

        const weaponTip = this.getWeaponTipPosition();
        const projectile = new Graphics();
        projectile.beginFill(0xffff00);
        projectile.drawCircle(0, 0, 4);
        projectile.endFill();
        projectile.x = this.x + weaponTip.x;
        projectile.y = this.y + weaponTip.y;

        const dx = targetPosition.x - (this.x + weaponTip.x);
        const dy = targetPosition.y - (this.y + weaponTip.y);

        const angle = Math.atan2(dy, dx);

        projectile.rotation = angle + Math.PI / 2;

        return {
            graphic: projectile,
            angle,
            speed: 6,
            owner: "enemy"
        };
    }

    private getWeaponTipPosition(): Point {
        const weaponTip = new Point();
        const weaponLength = 30;
        const angle = this.upperBody.rotation;

        weaponTip.x = Math.cos(angle) * weaponLength;
        weaponTip.y = Math.sin(angle) * weaponLength;

        return weaponTip;
    }
}
