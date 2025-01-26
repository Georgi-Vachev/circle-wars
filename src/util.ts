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
    renderer: Renderer, // Pass the renderer instance
    text: string,
    radius: number = 50,
    fillColor: number = 0xffffff,
    textStyleOptions: Partial<PIXI.TextStyle> = {}
): Sprite {
    // Create a container to hold the circle and text
    const container = new Container();

    // Create and draw the circle
    const circle = new Graphics();
    circle.beginFill(fillColor);
    circle.drawCircle(0, 0, radius);
    circle.endFill();

    // Add the circle to the container
    container.addChild(circle);

    // Merge default and passed-in text style options
    const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fill: '#000000',
        align: 'center',
        ...textStyleOptions,
    });

    // Create the text object
    const label = new Text(text, textStyle);

    // Position the text so it's centered within the circle
    label.anchor.set(0.5);
    label.position.set(0, 0); // Center the text

    // Add the text to the container
    container.addChild(label);

    // Generate a texture from the container using the renderer
    const texture = renderer.generateTexture(container);

    // Create a sprite from the generated texture
    const sprite = new Sprite(texture);

    // Center the sprite's anchor
    sprite.anchor.set(0.5);

    // Return the sprite
    return sprite;
}


// Example usage:
// const circleSprite = createCircleSpriteWithText("Hello!", 40, 0xff6600, { fill: '#ffffff' });
// app.stage.addChild(circleSprite);

