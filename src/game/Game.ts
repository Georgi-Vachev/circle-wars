import { Container, Point, Graphics, Application } from "pixi.js";
import Player from "./Player";
import Enemy from "./Enemy";

interface Projectile {
    graphic: Graphics;
    angle: number;
    speed: number;
}

export default class Game extends Container {
    private player: Player;
    private projectiles: Projectile[];
    private enemies: Enemy[];
    private spawnTimer: number;
    private app: Application;
    private mousePosition: Point;
    private shotCooldown: number;
    private isShooting: boolean;
    private config: any;

    constructor(config: any, app: any) {
        super();

        this.config = config;
        this.player = new Player(this.config.player);
        this.projectiles = [];
        this.enemies = [];
        this.spawnTimer = 0;
        this.app = app;
        this.isShooting = false;
        this.mousePosition = new Point();
        this.shotCooldown = 500;

        this.addChild(this.player);

        window.addEventListener("mousedown", (e) => this.onMouseDown(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
    }


    private onMouseDown(event: MouseEvent) {
        if (event.button === 0) {
            this.shootProjectile();
        }
    }

    private onMouseMove(event: MouseEvent) {
        this.mousePosition.set(event.clientX, event.clientY);
    }

    private onKeyDown(event: KeyboardEvent) {
        if (event.code === "Space") {
            this.isShooting = true;
        }
    }

    private onKeyUp(event: KeyboardEvent) {
        if (event.code === "Space") {
            this.isShooting = false;
        }
    }

    private shootProjectile() {
        const projectile = this.player.shootProjectile(this.mousePosition);

        this.projectiles.push(projectile);
        this.addChild(projectile.graphic);
    }

    private spawnEnemy() {
        const appCenter = new Point(this.app.renderer.width / 2, this.app.renderer.height / 2);
        const enemy = new Enemy(this.config.enemy, appCenter);
        this.enemies.push(enemy);
        this.addChild(enemy);
    }

    private updateEnemies(delta: number) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, this.app, new Point(this.player.x, this.player.y));

            if (
                enemy.x < 0 ||
                enemy.x > window.innerWidth ||
                enemy.y < 0 ||
                enemy.y > window.innerHeight
            ) {
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    private checkCollisions() {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.projectiles[i];

            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];

                const dx = projectile.graphic.x - enemy.x;
                const dy = projectile.graphic.y - enemy.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Check for circular collision
                if (distance < (enemy.width / 2 + projectile.graphic.width / 2)) {
                    this.removeChild(projectile.graphic);
                    this.projectiles.splice(i, 1);

                    this.removeChild(enemy);
                    this.enemies.splice(j, 1);

                    break;
                }
            }
        }
    }

    public update(delta: number) {
        this.player.update(delta);
        this.shotCooldown -= delta * this.app.ticker.elapsedMS;

        if (this.isShooting && this.shotCooldown <= 0) {
            this.shootProjectile();
            this.shotCooldown = 500;
        }

        this.updateProjectiles();
        this.updateEnemies(delta);
        this.checkCollisions();

        this.spawnTimer -= delta * this.app.ticker.elapsedMS;
        if (this.spawnTimer <= 0 && this.enemies.length < 4) {
            this.spawnEnemy();
            this.spawnTimer = 500 + Math.random() * 2000;
        }
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
