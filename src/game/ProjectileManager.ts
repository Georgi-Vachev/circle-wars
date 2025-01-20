import { Container, Graphics, Point, Application } from "pixi.js";
import { isOutOfBounds } from "../util";

interface Projectile {
    graphic: Graphics;
    angle: number;
    speed: number;
}

export default class ProjectileManager extends Container {
    private projectiles: Projectile[] = [];

    constructor(private app: Application) {
        super();
    }

    public addProjectile(projectile: Projectile) {
        this.projectiles.push(projectile);
        this.addChild(projectile.graphic);
    }

    public update() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.graphic.x += Math.cos(projectile.angle) * projectile.speed;
            projectile.graphic.y += Math.sin(projectile.angle) * projectile.speed;

            if (
                isOutOfBounds(
                    projectile.graphic.x,
                    projectile.graphic.y,
                    projectile.graphic.width,
                    projectile.graphic.height,
                    window.innerWidth,
                    window.innerHeight
                )
            ) {
                this.removeChild(projectile.graphic);
                this.projectiles.splice(i, 1);
            }
        }
    }

    public getProjectiles(): Projectile[] {
        return this.projectiles;
    }

    public removeProjectile(index: number) {
        const projectile = this.projectiles[index];
        this.removeChild(projectile.graphic);
        this.projectiles.splice(index, 1);
    }
}
