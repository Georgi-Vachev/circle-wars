import { Graphics, DisplayObject, Container, Text, TextStyle, Renderer, Sprite } from "pixi.js";

interface CollidableObject extends DisplayObject {
    width: number;
    height: number;
}

export function checkCollisions(
    projectiles: { graphic: Graphics }[],
    enemies: CollidableObject[]
): { projectileIndex: number; enemyIndex: number }[] {
    const collisions: { projectileIndex: number; enemyIndex: number }[] = [];

    for (let i = 0; i < projectiles.length; i++) {
        const projectile = projectiles[i];

        for (let j = 0; j < enemies.length; j++) {
            const enemy = enemies[j];

            const dx = projectile.graphic.x - enemy.x;
            const dy = projectile.graphic.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < (enemy.width / 2 + projectile.graphic.width / 2)) {
                collisions.push({ projectileIndex: i, enemyIndex: j });
            }
        }
    }

    return collisions;
}

export function isOutOfBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    screenWidth: number,
    screenHeight: number
) {
    return (
        x < 0 ||
        x + width > screenWidth ||
        y < 0 ||
        y + height > screenHeight
    );
}

export interface ButtonOptions {
    x: number;
    y: number;
    width: number;
    height: number;
    radius: number;
    backgroundColor: number;
    label: string;
    labelStyle?: Partial<TextStyle>;
    onClick?: () => void;
}

export function createButton(opts: ButtonOptions): Container {
    const container = new Container();

    const button = new Graphics();
    button.beginFill(opts.backgroundColor);
    button.drawRoundedRect(-opts.width / 2, -opts.height / 2, opts.width, opts.height, opts.radius);
    button.endFill();
    button.interactive = true;
    button.cursor = "pointer";
    container.addChild(button);

    const style = new TextStyle({ fill: "#000000", fontSize: 18, ...opts.labelStyle });
    const labelText = new Text(opts.label, style);
    labelText.anchor.set(0.5);
    container.addChild(labelText);

    container.x = opts.x;
    container.y = opts.y;

    if (opts.onClick) {
        button.on("pointerdown", opts.onClick);
    }

    return container;
}

import * as PIXI from 'pixi.js';

export function createCircleSpriteWithText(
    renderer: Renderer,
    text: string,
    radius: number = 50,
    fillColor: number = 0xffffff,
    textStyleOptions: Partial<PIXI.TextStyle> = {}
): Sprite {
    const container = new Container();

    const circle = new Graphics();
    circle.beginFill(fillColor);
    circle.drawCircle(0, 0, radius);
    circle.endFill();

    container.addChild(circle);

    const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fill: '#000000',
        align: 'center',
        ...textStyleOptions,
    });

    const label = new Text(text, textStyle);

    label.anchor.set(0.5);
    label.position.set(0, 0);

    container.addChild(label);

    const texture = renderer.generateTexture(container);
    const sprite = new Sprite(texture);

    sprite.anchor.set(0.5);

    return sprite;
}
