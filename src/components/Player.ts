import { Graphics, Container, Point } from "pixi.js";

interface Projectile {
    graphic: Graphics;
    angle: number;
    speed: number;
}

export default class Player extends Container {
    private upperBody: Graphics;
    private lowerBody: Container;
    private leftLeg: Graphics;
    private rightLeg: Graphics;
    private weapon: Graphics;
    private laser: Graphics;
    private projectiles: Projectile[];
    private speed: number;
    private keys: Record<string, boolean>;
    private mousePosition: Point;
    private isMoving: boolean;
    private walkingDirection: Point;
    private config: any;

    constructor(config: any) {
        super();
        this.upperBody = new Graphics();
        this.lowerBody = new Container();
        this.leftLeg = new Graphics();
        this.rightLeg = new Graphics();
        this.weapon = new Graphics();
        this.laser = new Graphics();
        this.projectiles = [];
        this.speed = 0;
        this.keys = {};
        this.mousePosition = new Point();
        this.isMoving = false;
        this.walkingDirection = new Point(0, 0);

        this.init(config);
    }

    private init(config: any) {
        this.config = config;
        this.speed = config.speed || 5;

        this.createLowerBody();
        this.createUpperBody();
        this.createWeapon();
        this.setPosition();
        this.setupEventListeners();

        this.addChild(this.lowerBody);
        this.addChild(this.upperBody);
        this.addChild(this.laser);
    }

    private createUpperBody() {
        this.upperBody.beginFill(this.config.bodyColor, 1);
        this.upperBody.drawCircle(0, 0, this.config.bodyRadius || 20);
        this.upperBody.endFill();
    }

    private createLowerBody() {
        this.leftLeg.beginFill(this.config.legColor);
        this.leftLeg.drawEllipse(-15, 0, this.config.legWidth, this.config.legHeight);
        this.leftLeg.endFill();

        this.rightLeg.beginFill(this.config.legColor);
        this.rightLeg.drawEllipse(15, 0, this.config.legWidth, this.config.legHeight);
        this.rightLeg.endFill();

        this.resetLegPosition();

        this.lowerBody.addChild(this.leftLeg);
        this.lowerBody.addChild(this.rightLeg);
    }

    private createWeapon() {
        this.weapon.beginFill(this.config.weaponColor || 0x00ff00);
        this.weapon.drawEllipse(30, 0, this.config.weaponWidth || 15, this.config.weaponHeight || 8);
        this.weapon.endFill();
        this.upperBody.addChild(this.weapon);
    }

    private setPosition() {
        this.x = this.config.startX || window.innerWidth / 2;
        this.y = this.config.startY || window.innerHeight / 2;
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

    private normalizePoint(point: Point) {
        const length = Math.sqrt(point.x * point.x + point.y * point.y);
        if (length > 0) {
            point.x /= length;
            point.y /= length;
        }
    }

    public update(delta: number) {
        const wasMoving = this.isMoving;
        this.isMoving = this.keys["w"] || this.keys["a"] || this.keys["s"] || this.keys["d"];

        this.updateLowerBodyRotation();
        this.updateUpperBodyRotation();
        this.updateLaser();

        if (this.isMoving) {
            this.updateWalkingDirection();
            this.updatePosition(delta);
            this.updateLegSwing();
        } else if (wasMoving) {
            this.resetLegPosition();
        }
    }

    public shootProjectile(mousePosition: Point): Projectile {
        const weaponTip = this.getWeaponTipPosition();
        const projectile = new Graphics();
        projectile.beginFill(0xffaaff);
        projectile.drawRect(-5, -5, 6, 24);
        projectile.endFill();

        projectile.x = this.x + weaponTip.x;
        projectile.y = this.y + weaponTip.y;

        const dx = mousePosition.x - (this.x + weaponTip.x);
        const dy = mousePosition.y - (this.y + weaponTip.y);
        const angle = Math.atan2(dy, dx);

        projectile.rotation = angle + Math.PI / 2;

        return { graphic: projectile, angle, speed: 8 };
    }

    private updateUpperBodyRotation() {
        const dx = this.mousePosition.x - this.x;
        const dy = this.mousePosition.y - this.y;
        const angleToMouse = Math.atan2(dy, dx);
        this.upperBody.rotation = angleToMouse + Math.PI / 2;
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
        const rotationAngle =
            this.keys["a"] && this.keys["w"] ? -45 :
                this.keys["w"] && this.keys["d"] ? 45 :
                    this.keys["a"] && this.keys["s"] ? -135 :
                        this.keys["s"] && this.keys["d"] ? 135 :
                            this.keys["a"] ? -90 :
                                this.keys["d"] ? 90 :
                                    this.keys["w"] ? 0 :
                                        this.keys["s"] ? 180 : 0;

        this.lowerBody.rotation = (rotationAngle * Math.PI) / 180;
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
    }

    private updateLegSwing() {
        const legSwing = Math.sin(Date.now() * (this.config.timeFactor || 0.02)) * this.config.legMovement;
        this.leftLeg.y = legSwing;
        this.rightLeg.y = -legSwing;
    }

    private resetLegPosition() {
        this.leftLeg.position.set(-15, 0);
        this.rightLeg.position.set(15, 0);
    }

    private getWeaponTipPosition(): Point {
        const weaponTip = new Point();
        const weaponLength = 30; // Distance of the weapon tip from the ceasnter
        const angle = this.upperBody.rotation;

        weaponTip.x = Math.cos(angle) * weaponLength;
        weaponTip.y = Math.sin(angle) * weaponLength;

        return weaponTip;
    }
}
