import { isOutOfBounds } from "../util";
import Enemy from "./Enemy";
import { Container, Point, Application } from "pixi.js";
import ProjectileManager from "./ProjectileManager";

export default class EnemyManager extends Container {
    private enemies: Enemy[] = [];
    private spawnTimer = 0;

    private enemyShootTimers = new WeakMap<Enemy, number>();

    constructor(private config: any, private app: Application, private projectileManager: ProjectileManager) {
        super();
    }

    public update(delta: number, playerPosition: Point) {
        this.spawnTimer -= delta * this.app.ticker.elapsedMS;

        if (this.spawnTimer <= 0 && this.enemies.length < 4) {
            this.spawnEnemy();
            this.spawnTimer = 500 + Math.random() * 2000;
        }

        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, this.app, playerPosition);

            if (
                isOutOfBounds(
                    enemy.x,
                    enemy.y,
                    enemy.width,
                    enemy.height,
                    window.innerWidth,
                    window.innerHeight
                )
            ) {
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
                continue;
            }

            this.handleEnemyShooting(delta, enemy, playerPosition);
        }
    }

    private handleEnemyShooting(delta: number, enemy: Enemy, playerPosition: Point) {
        if (!enemy.config.canShoot) return;

        let shootTimer = this.enemyShootTimers.get(enemy) ?? 0;

        shootTimer -= delta * this.app.ticker.elapsedMS;
        if (shootTimer <= 0) {
            const projectile = enemy.shootAt(playerPosition);
            if (projectile) {
                this.projectileManager.addProjectile(projectile);
            }

            shootTimer = enemy.config.shootCooldown ?? 1000;
        }

        this.enemyShootTimers.set(enemy, shootTimer);
    }

    private spawnEnemy() {
        const appCenter = new Point(
            this.app.renderer.width / 2,
            this.app.renderer.height / 2
        );
        const enemy = new Enemy(this.config.enemy, appCenter);
        this.enemies.push(enemy);
        this.addChild(enemy);

        this.enemyShootTimers.set(enemy, enemy.config.shootCooldown ?? 1000);
    }

    public getEnemies() {
        return this.enemies;
    }

    public removeEnemy(index: number) {
        const enemy = this.enemies[index];
        this.removeChild(enemy);
        this.enemies.splice(index, 1);
    }
}
