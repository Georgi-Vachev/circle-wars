import { Graphics, Container, Point } from "pixi.js";

export default class GameEntity extends Container {
    public config: any;
    protected upperBody: Graphics;
    protected lowerBody: Container;
    protected leftLeg: Graphics;
    protected rightLeg: Graphics;
    protected weapon: Graphics;
    protected movementDirection: Point;
    protected speed: number;
    protected health: number;
    protected maxHealth: number;
    protected healthBar: Graphics;

    constructor(config: any) {
        super();
        this.upperBody = new Graphics();
        this.lowerBody = new Container();
        this.leftLeg = new Graphics();
        this.rightLeg = new Graphics();
        this.weapon = new Graphics();
        this.healthBar = new Graphics();
        this.movementDirection = new Point(0, 0);
        this.speed = config.speed || 3;
        this.config = config;
        this.maxHealth = config.maxHealth ?? 2;
        this.health = config.health ?? this.maxHealth;

        this.init();
    }

    public takeDamage(amount: number) {
        this.health -= amount;
        if (this.health < 0) {
            this.health = 0;
        }
        this.updateHealthBar();
    }

    public isDead(): boolean {
        return this.health <= 0;
    }

    protected init() {
        this.createLowerBody();
        this.createUpperBody();
        this.createWeapon();

        this.x = this.config.startX || 0;
        this.y = this.config.startY || 0;

        this.addChild(this.lowerBody);
        this.addChild(this.upperBody);

        this.createHealthBar();
        this.updateHealthBar();
    }

    protected createHealthBar() {
        this.healthBar = new Graphics();
        const radius = this.config.bodyRadius ?? 20;
        this.healthBar.y = radius + 10;
        this.addChild(this.healthBar);
    }

    protected updateHealthBar() {
        this.healthBar.clear();

        this.healthBar.beginFill(0x000000);
        this.healthBar.drawRect(-25, 0, 50, 5);
        this.healthBar.endFill();

        const healthRatio = this.health / this.maxHealth;
        this.healthBar.beginFill(0xffee22);
        this.healthBar.drawRect(-25, 0, 50 * healthRatio, 5);
        this.healthBar.endFill();
    }

    protected createUpperBody() {
        this.upperBody.beginFill(this.config.bodyColor || 0xff0000, 1);
        this.upperBody.drawCircle(0, 0, this.config.bodyRadius || 20);
        this.upperBody.endFill();
    }

    protected createLowerBody() {
        this.leftLeg.beginFill(this.config.legColor);
        this.leftLeg.drawEllipse(-this.config.legOffset, 0, this.config.legWidth, this.config.legHeight);
        this.leftLeg.endFill();

        this.rightLeg.beginFill(this.config.legColor);
        this.rightLeg.drawEllipse(this.config.legOffset, 0, this.config.legWidth, this.config.legHeight);
        this.rightLeg.endFill();

        this.resetLegPosition();

        this.lowerBody.addChild(this.leftLeg);
        this.lowerBody.addChild(this.rightLeg);
    }

    protected createWeapon() {
        this.weapon.beginFill(this.config.weaponColor || 0x00ff00);
        this.weapon.drawEllipse(this.config.weaponOffset, 0, this.config.weaponWidth, this.config.weaponHeight);
        this.weapon.endFill();
        this.upperBody.addChild(this.weapon);
    }

    protected resetLegPosition() {
        this.leftLeg.position.set(-this.config.legOffset, 0);
        this.rightLeg.position.set(this.config.legOffset, 0);
    }

    protected normalizePoint(point: Point) {
        const length = Math.sqrt(point.x * point.x + point.y * point.y);
        if (length > 0) {
            point.x /= length;
            point.y /= length;
        }
    }

    protected updateLegSwing() {
        const legSwing = Math.sin(Date.now() * (this.config.timeFactor || 0.02)) * (this.config.legMovement || 10);
        this.leftLeg.y = legSwing;
        this.rightLeg.y = -legSwing;
    }
}
