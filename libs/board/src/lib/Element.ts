import { Container, PointData } from 'pixi.js';
import { v4 as uuid } from 'uuid';
import { GameObject, GameObjectManager, GameObjectState } from './GameObject';
import { Context } from './Context';

export enum ElementType {
  EMPTY = 'EMPTY',
  RECTANGLE = 'RECTANGLE',
}

export interface IElement {
  type: ElementType;
  id: string;
  position: PointData;
  scale: PointData;
  rotation: number;
  children: IElement[];
}

export class Element
  extends Container
  implements GameObject, GameObjectManager
{
  public readonly type: ElementType = ElementType.EMPTY;
  protected _gameObjectState: GameObjectState = GameObjectState.START;
  protected _ctx: Context | undefined;

  public id: string;

  constructor() {
    super();
    this.id = uuid();
  }

  setGameObjectState(state: GameObjectState): void {
    if (state === GameObjectState.DESTROY) {
      for (const element of this.children) {
        if (element instanceof Element) {
          element.setGameObjectState(GameObjectState.DESTROY);
        }
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

  draw(): void {
    // TODO: Implement
  }

  static from(empty: Element) {
    const e = new Element();

    e.id = empty.id;
    e.position.set(empty.position.x, empty.position.y);
    e.scale.set(empty.scale.x, empty.scale.y);
    e.rotation = empty.rotation;
    e.addChild(...empty.children.map((c) => Element.from(c as Element)));

    return e;
  }

  static fromJSON(json: Omit<IElement, 'type'>) {
    const e = new Element();

    e.id = json.id;
    e.position.set(json.position.x, json.position.y);
    e.scale.set(json.scale.x, json.scale.y);
    e.rotation = json.rotation;
    e.addChild(
      ...json.children
        .filter((it) => it instanceof Element)
        .map((c) => Element.fromJSON(c))
    );

    return e;
  }

  toJSON(): IElement {
    return {
      type: this.type,
      id: this.id,
      position: { x: this.position.x, y: this.position.y },
      scale: { x: this.scale.x, y: this.scale.y },
      rotation: this.rotation,
      children: this.children
        .filter((it) => it instanceof Element)
        .map((c) => (c as Element).toJSON()),
    };
  }
}
