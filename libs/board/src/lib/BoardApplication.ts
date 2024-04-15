import { Application, ICanvas, Ticker } from 'pixi.js';
import { Board } from './Board';
import { Context } from './Context';
import { GameObjectState } from './GameObject';
import { Element } from './elements';
import {
  InputSystem,
  PhysicSystem,
  SyncronizationSystem,
  System,
  UserSystem,
} from './systems';
import { SYSTEM_NAME } from './utilities';

export interface RunOptions {
  root: Window | HTMLElement;
  view: ICanvas;
  board: Board;
  systems: { [k: string]: System };
}

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

  async run(options: RunOptions) {
    await this.app.init({
      resizeTo: options.root,
      background: '#1099bb',
      canvas: options.view,
    });

    this.board = options.board;
    this.ctx = new Context(this.app);
    /**
     * Add systems
     */
    for (const [name, system] of Object.entries(options.systems)) {
      this.ctx.addSystem(name, system);
    }

    try {
      if (!options.systems[SYSTEM_NAME.SYNCRONIZATION])
        this.ctx.addSystem(
          SYSTEM_NAME.SYNCRONIZATION,
          new SyncronizationSystem('ws://localhost:8080/ws')
        );
    } catch {
      console.log('Syncronization system is not available');
    }

    if (!options.systems[SYSTEM_NAME.INPUT])
      this.ctx.addSystem(SYSTEM_NAME.INPUT, new InputSystem(this.app));
    if (!options.systems[SYSTEM_NAME.PHYSIC])
      this.ctx.addSystem(SYSTEM_NAME.PHYSIC, new PhysicSystem(this.app));
    if (!options.systems[SYSTEM_NAME.USER])
      this.ctx.addSystem(SYSTEM_NAME.USER, new UserSystem(this.board));

    /**
     * Init systems and board
     */
    this.app.stage.addChild(this.board);
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
    this.mainLoop.maxFPS = 120;
  }

  stop() {
    if (!this.mainLoop) throw new Error('Main loop is not running');

    this.ctx.destroy();
    this.board.destroy();
    this.mainLoop.stop();
  }
}
