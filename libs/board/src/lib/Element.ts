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

export class Element implements GameObject, GameObjectManager {
  public readonly type: ElementType = ElementType.EMPTY;
  protected _gameObjectState: GameObjectState = GameObjectState.START;
  protected _ctx: Context | undefined;

  protected _id: string;
  protected _transform: Transform;
  protected _children: Element[];
  protected _parent: Element | undefined;

  constructor() {
    this._id = uuid();
    this._transform = new Transform();
    this._children = [];
  }

  get id(): string {
    return this._id;
  }

  set ctx(ctx: Context) {
    for (const child of this._children) {
      child.ctx = ctx;
    }

    this._ctx = ctx;
  }

  get ctx(): Context {
    if (!this._ctx) {
      throw new Error('Context not set');
    }

    return this._ctx;
  }

  get parent(): Element | undefined {
    return this._parent;
  }

  get transform(): Transform {
    return this._transform;
  }

  get children(): Element[] {
    return this._children;
  }

  set children(children: Element[]) {
    for (const child of children) {
      child._parent = this;
    }

    this._children = children;
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

  removeChild(child: Element) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
    }
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

  destroy(): void {
    for (const element of this._children) {
      element.destroy();
    }

    this._children = [];
    this._parent = undefined;
  }

  static from(empty: Element) {
    const e = new Element();

    e._id = empty.id;
    e._transform = Transform.from(empty.transform);
    e.children = empty.children.map((c) => Element.from(c));

    return e;
  }

  static fromJSON(json: Omit<IElement, 'type'>) {
    const e = new Element();

    e._id = json.id;
    e._transform = Transform.fromJSON(json.transform);
    e.children = json.children.map((c) => Element.fromJSON(c));

    return e;
  }

  toJSON(): IElement {
    return {
      type: this.type,
      id: this._id,
      transform: this._transform.toJSON(),
      children: this._children.map((c) => c.toJSON()),
    };
  }
}
