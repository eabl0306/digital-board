import { v4 as uuid } from 'uuid';
import { ITransform, Transform } from './Transform';

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

export class Element {
  public readonly type: ElementType = ElementType.EMPTY;

  protected _id: string;
  protected _transform: Transform;
  protected _children: Element[] = [];
  protected _parent: Element | undefined;

  constructor() {
    this._id = uuid();
    this._transform = new Transform();
  }

  get id(): string {
    return this._id;
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

  get parent(): Element | undefined {
    return this._parent;
  }

  removeChild(child: Element) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
    }
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
