// InputManager.ts
export default class InputManager {
    public keys: Record<string, boolean> = {};
    public mouse: { x: number; y: number; isDown: boolean } = {
        x: 0,
        y: 0,
        isDown: false,
    };

    constructor() {
        window.addEventListener("mousedown", (e) => {
            if (e.button === 0) {
                this.mouse.isDown = true;
            }
        });

        window.addEventListener("mouseup", () => {
            this.mouse.isDown = false;
        });

        window.addEventListener("mousemove", (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener("keydown", (e) => {
            this.keys[e.code] = true;
        });

        window.addEventListener("keyup", (e) => {
            this.keys[e.code] = false;
        });
    }
}
