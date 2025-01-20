// EnemyManager.ts
import { isOutOfBounds } from "../util";
import Enemy from "./Enemy";
import { Container, Point, Application } from "pixi.js";

export default class EnemyManager extends Container {
    private enemies: Enemy[] = [];
    private spawnTimer = 0;

    constructor(private config: any, private app: Application) {
        super();
    }

    public update(delta: number, playerPosition: Point) {
        this.spawnTimer -= delta * this.app.ticker.elapsedMS;

        // Spawn logic
        if (this.spawnTimer <= 0 && this.enemies.length < 4) {
            this.spawnEnemy();
            this.spawnTimer = 500 + Math.random() * 2000;
        }

        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.update(delta, this.app, playerPosition);

            if (isOutOfBounds(enemy.x, enemy.y, enemy.width, enemy.height, window.innerWidth, window.innerHeight)) {
                this.removeChild(enemy);
                this.enemies.splice(i, 1);
            }
        }
    }

    private spawnEnemy() {
        const appCenter = new Point(
            this.app.renderer.width / 2,
            this.app.renderer.height / 2
        );
        const enemy = new Enemy(this.config.enemy, appCenter);
        this.enemies.push(enemy);
        this.addChild(enemy);
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
