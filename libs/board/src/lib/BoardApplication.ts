import { Application, ICanvas, Ticker } from 'pixi.js';
import { Board } from './Board';
import { Element } from './Element';
import { GameObjectState } from './GameObject';
import { Context } from './Context';

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
      const state = element.getGameObjectState();
      switch (state) {
        case GameObjectState.START:
          element.start();
          element.setGameObjectState(GameObjectState.STARTED);
          break;
        case GameObjectState.STARTED:
          element.update(delta);
          element.draw();
          break;
        case GameObjectState.DESTROY:
          element.destroy();
          element.setGameObjectState(GameObjectState.DESTROYED);
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

    this.app.stage.addChild(board);
    this.ctx.init();
    this.board.start();

    this.mainLoop = this.app.ticker.add((delta) => {
      this.ctx.update(delta.deltaTime);
      this.board.update(delta.deltaTime);
      this.board.draw();
      this.runElements(
        delta.deltaTime,
        this.board.children.filter((e) => e instanceof Element) as Element[]
      );
    });
  }

  stop() {
    if (!this.mainLoop) throw new Error('Main loop is not running');

    this.ctx.destroy();
    this.board.destroy();
    this.mainLoop.stop();
  }
}
