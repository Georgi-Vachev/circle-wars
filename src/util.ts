import { Graphics, DisplayObject } from "pixi.js";

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
