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
}

export class Element {
  public readonly type: ElementType = ElementType.EMPTY;

  protected _id: string;
  protected _transform: Transform;

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

  static from(empty: Element) {
    const e = new Element();

    e._id = empty.id;
    e._transform = Transform.from(empty.transform);

    return e;
  }

  static fromJSON(json: Omit<IElement, 'type'>) {
    const e = new Element();

    e._id = json.id;
    e._transform = Transform.fromJSON(json.transform);

    return e;
  }

  toJSON(): IElement {
    return {
      type: this.type,
      id: this._id,
      transform: this._transform.toJSON(),
    };
  }
}
