import GameEntity from "./GameEntity";
import { Application, Graphics, Point } from "pixi.js";
import { Projectile } from "./ProjectileManager";
import Game from "./Game";

export default class Player extends GameEntity {
    private app: Application;
    private laser: Graphics;
    private keys: Record<string, boolean>;
    private mousePosition: Point;
    private isMoving: boolean;
    private walkingDirection: Point;

    constructor(app: Application) {
        super(Game.config.player);

        this.app = app;
        this.laser = new Graphics();
        this.keys = {};
        this.mousePosition = new Point();
        this.isMoving = false;
        this.walkingDirection = new Point(0, 0);

        this.setupEventListeners();
        this.addChild(this.laser);
    }

    private setupEventListeners() {
        window.addEventListener("keydown", (e) => this.onKeyDown(e));
        window.addEventListener("keyup", (e) => this.onKeyUp(e));
        window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    }

    private onKeyDown(event: KeyboardEvent) {
        this.keys[event.key] = true;
    }

    private onKeyUp(event: KeyboardEvent) {
        this.keys[event.key] = false;
    }

    private onMouseMove(event: MouseEvent) {
        this.mousePosition.set(event.clientX, event.clientY);
    }

    public update(delta: number) {
        this.isMoving = this.keys["w"] || this.keys["a"] || this.keys["s"] || this.keys["d"];
        this.updateLowerBodyRotation();
        this.updateUpperBodyRotation();
        this.updateLaser();

        if (this.isMoving) {
            this.updateWalkingDirection();
            this.updatePosition(delta);
            this.updateLegSwing();
        } else {
            this.resetLegPosition();
        }
    }

    private updateUpperBodyRotation() {
        const dx = this.mousePosition.x - this.x;
        const dy = this.mousePosition.y - this.y;
        this.upperBody.rotation = Math.atan2(dy, dx) + Math.PI / 2;
    }

    private updateLaser() {
        const weaponTip = this.getWeaponTipPosition();
        this.laser.clear();
        this.laser.lineStyle(2, 0xff0000, 1);
        this.laser.moveTo(weaponTip.x, weaponTip.y);

        const localMousePosition = this.toLocal(this.mousePosition);
        this.laser.lineTo(localMousePosition.x, localMousePosition.y);
    }

    private updateLowerBodyRotation() {
        if (this.isMoving) {
            const angle = Math.atan2(this.walkingDirection.y, this.walkingDirection.x);
            this.lowerBody.rotation = angle + Math.PI / 2;
        }
    }

    private updateWalkingDirection() {
        this.walkingDirection.set(
            (this.keys["d"] ? 1 : 0) - (this.keys["a"] ? 1 : 0),
            (this.keys["s"] ? 1 : 0) - (this.keys["w"] ? 1 : 0)
        );
        this.normalizePoint(this.walkingDirection);
    }

    private updatePosition(delta: number) {
        this.x += this.walkingDirection.x * this.speed * delta;
        this.y += this.walkingDirection.y * this.speed * delta;

        this.x = Math.max(this.upperBody.width / 2, Math.min(this.app.renderer.width - this.upperBody.width / 2, this.x));
        this.y = Math.max(this.upperBody.height / 2, Math.min(this.app.renderer.height - this.upperBody.height / 2, this.y));
    }

    public shootProjectile(mousePosition: Point): Projectile {
        const weaponTip = this.getWeaponTipPosition();
        const projectile = new Graphics();
        projectile.beginFill(0xffaaff);
        projectile.drawEllipse(-5, -5, 4, 14);
        projectile.endFill();

        projectile.x = this.x + weaponTip.x;
        projectile.y = this.y + weaponTip.y;

        const dx = mousePosition.x - (this.x + weaponTip.x);
        const dy = mousePosition.y - (this.y + weaponTip.y);
        const angle = Math.atan2(dy, dx);

        projectile.rotation = angle + Math.PI / 2;

        return { graphic: projectile, angle, speed: 12, owner: "player" };
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
