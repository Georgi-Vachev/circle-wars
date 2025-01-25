import { Layer } from '@pixi/layers'
import * as PIXI from 'pixi.js'

export enum Layers {
    BONUS_GAME = 'BonusGame',
    UI = 'UI',
    GAME_ENTITIES = 'GameEntities',
}

export class LayerManager extends Layer {
    public LayersOrder

    constructor() {
        super()

        this.group.enableSort = true

        this.LayersOrder = [
            Layers.GAME_ENTITIES,
            Layers.BONUS_GAME,
            Layers.UI,
        ]
    }

    assignZOrder(element: PIXI.Sprite | PIXI.Container, layer: Layers) {
        element.parentLayer = this
        element.zOrder = this.LayersOrder.indexOf(layer)
        console.error(element.zOrder)
    }
}
