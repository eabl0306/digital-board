import { Application, ICanvas, Ticker } from 'pixi.js';
import { Board } from './Board';
import { Element } from './elements';
import { GameObjectState } from './GameObject';
import { Context } from './Context';
import { InputSystem, PhysicSystem } from './systems';

export class BoardApplication {
  private mainLoop: Ticker | undefined;

  private app: Application;
  private ctx!: Context;
  private board!: Board;

  constructor() {
    this.app = new Application();
  }

  set maxFPS(fps: number) {
    this.app.ticker.maxFPS = Math.max(0, fps);
  }

  get maxFPS() {
    return this.app.ticker.maxFPS;
  }

  private runElements(delta: number, elements: Element[]) {
    for (const element of elements) {
      const state = element.getState();
      switch (state) {
        case GameObjectState.START:
          element.start();
          element.setState(GameObjectState.STARTED);
          break;
        case GameObjectState.STARTED:
          element.update(delta);
          element.draw();
          break;
        case GameObjectState.DESTROY:
          element.destroy();
          element.setState(GameObjectState.DESTROYED);
          break;
        case GameObjectState.DESTROYED:
          if (!element.parent) this.board.removeChild(element);
          else element.parent.removeChild(element);
          break;
        default:
          break;
      }

      if (state == GameObjectState.INACTIVE) continue;

      this.runElements(
        delta,
        element.children.filter((e) => e instanceof Element) as Element[]
      );
    }
  }

  async run(root: Window | HTMLElement, view: ICanvas, board: Board) {
    await this.app.init({
      resizeTo: root,
      background: '#1099bb',
      canvas: view,
    });

    this.board = board;
    this.ctx = new Context(this.app);
    /**
     * Add systems
     */
    this.ctx.addSystem('input', new InputSystem(this.app));
    this.ctx.addSystem('physic', new PhysicSystem(this.app));

    /**
     * Init systems and board
     */
    this.app.stage.addChild(board);
    this.ctx.init();
    this.board.start();

    this.mainLoop = this.app.ticker.add((delta) => {
      const dt = delta.deltaMS;
      const elements = this.board.children.filter((e) => e instanceof Element);
      this.ctx.update(dt);
      this.board.update(dt);
      this.board.draw();
      this.runElements(dt, elements as Element[]);
    });
    this.mainLoop.maxFPS = 60;
  }

  stop() {
    if (!this.mainLoop) throw new Error('Main loop is not running');

    this.ctx.destroy();
    this.board.destroy();
    this.mainLoop.stop();
  }
}
