import { Container, Point, Graphics } from "pixi.js";
import Player from "./Player";

interface Projectile {
    graphic: Graphics;
    angle: number;
    speed: number;
}

export default class Game extends Container {
    private player: Player;
    private projectiles: Projectile[];

    constructor(config: any, app: any) {
        super();

        this.player = new Player(config.player);
        this.projectiles = [];
        this.addChild(this.player);

        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
    }

    private onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            const mousePosition = new Point(event.clientX, event.clientY);
            const projectile = this.player.shootProjectile(mousePosition);

            this.projectiles.push(projectile);
            this.addChild(projectile.graphic);
        }
    }

    public update(delta: number) {
        this.player.update(delta);
        this.updateProjectiles();
    }

    private updateProjectiles() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];
            projectile.graphic.x += Math.cos(projectile.angle) * projectile.speed;
            projectile.graphic.y += Math.sin(projectile.angle) * projectile.speed;

            if (
                projectile.graphic.x < 0 ||
                projectile.graphic.x > window.innerWidth ||
                projectile.graphic.y < 0 ||
                projectile.graphic.y > window.innerHeight
            ) {
                this.removeChild(projectile.graphic);
                this.projectiles.splice(i, 1);
            }
        }
    }
}
