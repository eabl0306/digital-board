import { IVector, Vector } from './Vector';

export interface ITransform {
  position: IVector;
  rotation: number;
  scale: number;
}

export class Transform {
  protected _position: Vector;
  protected _rotation: number;
  protected _scale: number;

  constructor() {
    this._position = new Vector();
    this._rotation = 0;
    this._scale = 1;
  }

  set position(position: Vector) {
    this._position = position;
  }

  get position(): Vector {
    return this._position;
  }

  set rotation(rotation: number) {
    this._rotation = rotation;
  }

  get rotation(): number {
    return this._rotation;
  }

  set scale(scale: number) {
    this._scale = scale;
  }

  get scale(): number {
    return this._scale;
  }

  static from(transform: Transform) {
    const t = new Transform();

    t.position = Vector.from(transform.position);
    t.rotation = transform.rotation;
    t.scale = transform.scale;

    return t;
  }

  static fromJSON({ position, rotation, scale }: ITransform) {
    const t = new Transform();

    t.position = Vector.fromJSON(position);
    t.rotation = rotation;
    t.scale = scale;

    return t;
  }

  toJSON(): ITransform {
    return {
      position: this.position.toJSON(),
      rotation: this.rotation,
      scale: this.scale,
    };
  }
}
