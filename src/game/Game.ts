import { Container, Point, Application } from "pixi.js";
import gsap from "gsap";
import Player from "./Player";
import { checkCollisions } from "../util";
import InputManager from "./InputManager";
import EnemyManager from "./EnemyManager";
import ProjectileManager from "./ProjectileManager";
import GameOverScreen from "./GameOverScreen";
import UI from "./UI";
import BonusGameManager from "./BonusGameManager";

export const EVENTS = {
    START_BONUS_GAME: "startBonusGame",
}
export default class Game extends Container {
    private player: Player;
    private shotCooldown: number;
    private isShooting: boolean;
    private mousePosition: Point;
    private inputManager: InputManager;
    private enemyManager: EnemyManager;
    private projectileManager: ProjectileManager;
    private isGameOver: boolean;
    private config: any;
    private app: Application;
    private spawnTimer: number;
    private ui: UI;
    private gameOverScreen?: GameOverScreen;
    private bonusGameManager: BonusGameManager;
    private isBonusGameActive: boolean;

    constructor(config: any, app: Application) {
        super();

        this.config = config;
        this.app = app;
        this.inputManager = new InputManager();
        this.projectileManager = new ProjectileManager(app);
        this.enemyManager = new EnemyManager(config, app, this.projectileManager);
        this.player = new Player(app, this.config.player);
        this.bonusGameManager = new BonusGameManager(app);

        this.shotCooldown = 500;
        this.isShooting = false;
        this.mousePosition = new Point();
        this.spawnTimer = 0;
        this.isGameOver = false;
        this.isBonusGameActive = false;
        this.ui = new UI(app);

        this.addChild(this.player);
        this.addChild(this.enemyManager);
        this.addChild(this.projectileManager);
        this.addChildAt(this.ui, 3);
        this.addChild(this.bonusGameManager);

        this.setupListeners();
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
        const allProjectiles = this.projectileManager.getProjectiles();
        const enemies = this.enemyManager.getEnemies();

        const playerBullets = allProjectiles.filter(p => p.owner === "player");
        const collisionsPE = checkCollisions(playerBullets, enemies);
        collisionsPE.forEach(({ projectileIndex, enemyIndex }) => {
            const projectile = playerBullets[projectileIndex];
            this.projectileManager.removeProjectileByObject(projectile);
            const enemy = enemies[enemyIndex];
            enemy.takeDamage(1);
            if (enemy.isDead()) {
                if (enemy.config.scoreValue) {
                    this.ui.addScore(enemy.config.scoreValue);
                }

                this.enemyManager.removeEnemy(enemyIndex);
            }
        });

        const enemyBullets = allProjectiles.filter(p => p.owner === "enemy");
        for (let i = 0; i < enemyBullets.length; i++) {
            const bullet = enemyBullets[i];
            const playerRadius = this.player.config.bodyRadius ?? 20;
            const bulletRadius = bullet.graphic.width * 0.5;
            const dx = bullet.graphic.x - this.player.x;
            const dy = bullet.graphic.y - this.player.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < playerRadius + bulletRadius) {
                this.projectileManager.removeProjectileByObject(bullet);
                this.player.takeDamage(1);
                if (this.player.isDead()) {
                    this.gameOver();
                    return;
                }
            }
        }

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const combinedRadius =
                (this.player.config.bodyRadius ?? 20) +
                (enemy.config.bodyRadius ?? 20);
            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < combinedRadius) {
                this.player.config.hasThorns ? enemy.takeDamage(1) : this.player.takeDamage(1);
                if (this.player.isDead()) {
                    this.gameOver();
                    return;
                }

                if (enemy.isDead()) {
                    if (enemy.config.scoreValue) {
                        this.ui.addScore(enemy.config.scoreValue);
                    }

                    this.enemyManager.removeEnemy(i);
                }
            }
        }
    }

    public update(delta: number) {
        if (this.isGameOver || this.isBonusGameActive) return;

        this.player.update(delta);
        this.enemyManager.update(delta, new Point(this.player.x, this.player.y));
        this.projectileManager.update();
        this.ui.update(delta * this.app.ticker.elapsedMS / 1000);

        this.shotCooldown -= delta * this.app.ticker.elapsedMS;
        this.spawnTimer -= delta * this.app.ticker.elapsedMS;

        if (this.isShooting && this.shotCooldown <= 0) {
            this.shootProjectile();
            this.shotCooldown = 200;
        }

        this.checkCollisions();
    }

    private gameOver() {
        if (this.isGameOver) return;
        this.isGameOver = true;

        this.gameOverScreen = new GameOverScreen(this.app, () => {
            if (this.gameOverScreen) {
                gsap.to(this.gameOverScreen, {
                    duration: 0.5,
                    alpha: 0,
                    onComplete: () => {
                        if (this.gameOverScreen)
                            this.removeChild(this.gameOverScreen);
                        this.restartGame();
                    }
                });
            }
        });

        this.gameOverScreen.alpha = 0;
        this.addChild(this.gameOverScreen);
        gsap.to(this.gameOverScreen, { duration: 1, alpha: 1 });
    }

    private restartGame() {
        this.enemyManager.removeChildren();
        this.projectileManager.removeChildren();

        this.removeChild(this.player);
        this.player = new Player(this.app, this.config.player);
        this.addChild(this.player);

        this.enemyManager = new EnemyManager(this.config, this.app, this.projectileManager);
        this.addChild(this.enemyManager);

        this.shotCooldown = 200;
        this.isShooting = false;
        this.mousePosition.set(0, 0);
        this.spawnTimer = 0;
        this.isGameOver = false;
        this.ui.reset();
    }

    public resize() {
        this.ui.resize();
        this.bonusGameManager.resize();
        this.gameOverScreen?.resize();
    }

    private setupListeners() {
        window.addEventListener("mousedown", () => this.onMouseDown());
        window.addEventListener("mousemove", () => this.onMouseMove());
        window.addEventListener("keydown", () => this.onKeyDown());
        window.addEventListener("keyup", () => this.onKeyUp());

        this.ui.on(EVENTS.START_BONUS_GAME, () => {
            this.isBonusGameActive = true;
            this.bonusGameManager.startRandomBonusGame();
        })
    }
}
