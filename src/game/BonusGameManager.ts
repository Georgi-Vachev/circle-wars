import { Container, Application, Graphics } from "pixi.js"
import SlotBG from "./bonusGames/SlotBG"
import TargetPracticeBG from "./bonusGames/TargetPracticeBG"
import QuizBG from "./bonusGames/QuizBG"
import QuickMathsBG from "./bonusGames/QuickMathsBG"
import { EVENTS } from "./Game"


export default class BonusGameManager extends Container {
    private app: Application
    private overlay: Graphics
    private currentBonusGame: Container | null = null
    private bonusGames = [SlotBG, TargetPracticeBG, QuizBG, QuickMathsBG]

    constructor(app: Application) {
        super()
        this.app = app
        this.overlay = new Graphics()

        this.addOverley()
    }

    public resize(): void {
        this.overlay.clear()
        this.overlay.beginFill(0x000000, 0.6)
        this.overlay.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height)
        this.overlay.endFill()
    }

    public startRandomBonusGame(): void {
        if (this.currentBonusGame) {
            this.removeChild(this.currentBonusGame)
            this.currentBonusGame.destroy()
            this.currentBonusGame = null
        }

        this.overlay.visible = true
        const randomIndex = Math.floor(Math.random() * this.bonusGames.length)
        const BonusGameClass = this.bonusGames[0]
        this.currentBonusGame = new BonusGameClass(this.app)

        this.currentBonusGame.on(EVENTS.END_BONUS_GAME, () => {
            this.overlay.visible = false
            this.destroyCurrentBonusGame()
            this.emit(EVENTS.END_BONUS_GAME)
        })

        this.addChild(this.currentBonusGame)
    }

    private addOverley(): void {
        this.overlay.beginFill(0x000000, 0.6)
        this.overlay.drawRect(0, 0, this.app.renderer.width, this.app.renderer.height)
        this.overlay.endFill()
        this.overlay.visible = false

        this.addChild(this.overlay)
    }

    private destroyCurrentBonusGame(): void {
        if (this.currentBonusGame) {
            this.removeChild(this.currentBonusGame)
            this.currentBonusGame.destroy()
            this.currentBonusGame = null
        }
    }
}
