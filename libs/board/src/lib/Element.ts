import { Container } from 'pixi.js';
import { v4 as uuid } from 'uuid';
import { ITransform, Transform } from './Transform';
import { GameObject, GameObjectManager, GameObjectState } from './GameObject';
import { Context } from './Context';

export enum ElementType {
  EMPTY = 'EMPTY',
  RECTANGLE = 'RECTANGLE',
}

export interface IElement {
  type: ElementType;
  id: string;
  transform: ITransform;
  children: IElement[];
}

export class Element
  extends Container<Element>
  implements GameObject, GameObjectManager
{
  public readonly isBoardElement = true;
  public readonly type: ElementType = ElementType.EMPTY;
  protected _gameObjectState: GameObjectState = GameObjectState.START;
  protected _ctx: Context | undefined;

  public id: string;
  public override readonly transform: Transform;

  constructor() {
    super();
    this.id = uuid();
    this.transform = new Transform();
  }

  setGameObjectState(state: GameObjectState): void {
    if (state === GameObjectState.DESTROY) {
      for (const element of this.children) {
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

  draw(): void {
    // TODO: Implement
  }

  static from(empty: Element) {
    const e = new Element();

    e.id = empty.id;
    e.setTransform(
      empty.transform.position.x,
      empty.transform.position.y,
      empty.transform.scale.x,
      empty.transform.scale.y,
      empty.transform.rotation
    );
    e.addChild(...empty.children.map((c) => Element.from(c)));

    return e;
  }

  static fromJSON(json: Omit<IElement, 'type'>) {
    const e = new Element();

    e.id = json.id;
    e.setTransform(
      json.transform.position.x,
      json.transform.position.y,
      json.transform.scale.x,
      json.transform.scale.y,
      json.transform.rotation
    );
    e.addChild(...json.children.map((c) => Element.fromJSON(c)));

    return e;
  }

  toJSON(): IElement {
    return {
      type: this.type,
      id: this.id,
      transform: this.transform.toJSON(),
      children: this.children.map((c) => c.toJSON()),
    };
  }
}
