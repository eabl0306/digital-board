import { Application, ICanvas, Ticker } from 'pixi.js';
import { Board } from './Board';
import { Element } from './Element';
import { GameObjectState } from './GameObject';
import { Context } from './Context';

export class BoardApplication {
  private mainLoop: Ticker | undefined;

  private app: Application;
  private ctx: Context;
  private board: Board;

  constructor(root: Window | HTMLElement, view: ICanvas, board: Board) {
    this.app = new Application({ view: view, resizeTo: root, antialias: true });
    this.ctx = new Context(this.app);

    this.app.ticker.maxFPS = 60;
    this.app.stage.addChild(board);
    this.board = board;
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
        element.children.filter((e) => e.isBoardElement)
      );
    }
  }

  run() {
    if (!this.app.view.addEventListener) {
      throw new Error('Cannot add event listener to the view');
    }

    this.ctx.init();
    this.board.start();

    this.mainLoop = this.app.ticker.add((delta) => {
      this.ctx.update(delta);
      this.board.update(delta);
      this.board.draw();
      this.runElements(
        delta,
        this.board.children.filter((e) => e.isBoardElement)
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
