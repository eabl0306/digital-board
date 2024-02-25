import { Element as TElement } from '@front-monorepo/types';
import { GameObject, GameObjectManager, GameObjectState } from './GameObject';

export class Element extends TElement implements GameObject, GameObjectManager {
  protected _gameObjectState: GameObjectState = GameObjectState.START;
  protected override _children: Element[];

  constructor() {
    super();
    this._children = [];
  }

  override set children(elements: Element[]) {
    super.children = elements;
  }

  override get children(): Element[] {
    return this._children;
  }

  setGameObjectState(state: GameObjectState): void {
    if (state === GameObjectState.DESTROY) {
      for (const element of this._children) {
        element.setGameObjectState(GameObjectState.DESTROY);
      }
    }

    this._gameObjectState = state;
  }
  getGameObjectState(): GameObjectState {
    return this._gameObjectState;
  }

  start(): void {
    // TODO: Implement
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
    // TODO: Implement
  }

  destroy(): void {
    for (const element of this._children) {
      element.destroy();
    }

    this._children = [];
    this._parent = undefined;
  }
}
