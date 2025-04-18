export default {
  renderer: {
    backgroundColor: 0x555555,
  },
  margin: 15,
  player: {
    bodyColor: 0xff0000,
    bodyRadius: 25,
    legColor: 0x000000,
    legWidth: 8,
    legHeight: 12,
    weaponColor: 0x00ff00,
    weaponWidth: 8,
    weaponHeight: 20,
    startX: window.innerWidth / 2,
    startY: window.innerHeight / 2,
    speed: 7,
    laserColor: 0xffff00,
    laserWidth: 30,
    laserHeight: 6,
    laserSpeed: 15,
    legOffset: 15,
    legMovement: 35,
    timeFactor: 0.015,
    weaponOffset: 32,
    weaponOscillation: 8,
    weaponOscillationSpeed: 0.007,
    maxHealth: 4,
    health: 4,
    hasThorns: false,
  },
  enemy: {
    minSpawnRadius: 150,
    maxSpawnRadius: 400,
    bodyColor: 0xff44aa,
    bodyRadius: 18,
    legColor: 0x000000,
    legWidth: 4,
    legHeight: 8,
    weaponColor: 0x00ff00,
    weaponWidth: 6,
    weaponHeight: 15,
    speed: 2,
    laserColor: 0xffff00,
    laserWidth: 30,
    laserHeight: 6,
    laserSpeed: 15,
    legOffset: 10,
    legMovement: 14,
    timeFactor: 0.015,
    weaponOffset: 24,
    weaponOscillation: 8,
    weaponOscillationSpeed: 0.007,
    maxHealth: 2,
    health: 2,
    canShoot: true,
    shootCooldown: 1000,
    scoreValue: 1
  },
  powerUps: {
    doubleDMG: { text: 'x2\nDMG', color: 0x332244 },
    thorns: { text: 'THORNS', color: 0x4f213e },
    heal: { text: 'HEAL', color: 0xaafe31 },
    movementSpeed: { text: 'MOVE\nSPEED', color: 0xf7a1e9 },
    shootSpeed: { text: 'SHOOT\nSPEED', color: 0xb1c4d8 }
  },
};
