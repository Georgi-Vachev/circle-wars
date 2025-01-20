import { Container, Point, Graphics, Application } from "pixi.js";
import Player from "./Player";
import { checkCollisions } from "../util";
import InputManager from "./InputManager";
import EnemyManager from "./EnemyManager";
import ProjectileManager from "./ProjectileManager";

export default class Game extends Container {
    private player: Player;
    private shotCooldown: number;
    private isShooting: boolean;
    private mousePosition: Point;
    private inputManager: InputManager;
    private enemyManager: EnemyManager;
    private projectileManager: ProjectileManager;

    private config: any;
    private app: Application;
    private spawnTimer: number;

    constructor(config: any, app: Application) {
        super();

        this.inputManager = new InputManager();
        this.enemyManager = new EnemyManager(config, app);
        this.projectileManager = new ProjectileManager(app);

        this.config = config;
        this.player = new Player(this.config.player);
        this.app = app;

        this.shotCooldown = 500;
        this.isShooting = false;
        this.mousePosition = new Point();
        this.spawnTimer = 0;

        this.addChild(this.player);
        this.addChild(this.enemyManager);
        this.addChild(this.projectileManager);

        window.addEventListener("mousedown", () => this.onMouseDown());
        window.addEventListener("mousemove", () => this.onMouseMove());
        window.addEventListener("keydown", () => this.onKeyDown());
        window.addEventListener("keyup", () => this.onKeyUp());
    }

    private onMouseDown() {
        if (this.inputManager.mouse.isDown) {
            this.shootProjectile();
        }
    }

    private onMouseMove() {
        this.mousePosition.set(this.inputManager.mouse.x, this.inputManager.mouse.y);
    }

    private onKeyDown() {
        if (this.inputManager.keys["Space"]) {
            this.isShooting = true;
        }
    }

    private onKeyUp() {
        if (!this.inputManager.keys["Space"]) {
            this.isShooting = false;
        }
    }

    private shootProjectile() {
        const projectile = this.player.shootProjectile(this.mousePosition);
        this.projectileManager.addProjectile(projectile);
    }

    private checkCollisions() {
        // Grab references
        const projectiles = this.projectileManager.getProjectiles();
        const enemies = this.enemyManager.getEnemies();

        const collisions = checkCollisions(projectiles, enemies);

        collisions.forEach(({ projectileIndex, enemyIndex }) => {
            this.projectileManager.removeProjectile(projectileIndex);
            this.enemyManager.removeEnemy(enemyIndex);
        });
    }

    public update(delta: number) {
        this.player.update(delta);
        this.enemyManager.update(delta, new Point(this.player.x, this.player.y));
        this.projectileManager.update();

        this.shotCooldown -= delta * this.app.ticker.elapsedMS;
        this.spawnTimer -= delta * this.app.ticker.elapsedMS;

        if (this.isShooting && this.shotCooldown <= 0) {
            this.shootProjectile();
            this.shotCooldown = 500;
        }

        this.checkCollisions();
    }
}
