import App from './App';
import config from './config/config';

const app = new App(config);

(globalThis as any).__PIXI_APP__ = app;