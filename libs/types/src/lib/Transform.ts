import { Vector } from './Vector';

export class Transform {
  protected _position: Vector;
  protected _rotation: number;
  protected _scale: number;

  constructor(
    position: Vector = new Vector(),
    rotation: number = 0,
    scale: number = 1
  ) {
    this._position = position;
    this._rotation = rotation;
    this._scale = scale;
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

  static fromJSON({
    position,
    rotation,
    scale,
  }: {
    position: Vector;
    rotation: number;
    scale: number;
  }) {
    const t = new Transform();

    t.position = Vector.fromJSON(position);
    t.rotation = rotation;
    t.scale = scale;

    return t;
  }

  toJSON() {
    return {
      position: this.position.toJSON(),
      rotation: this.rotation,
      scale: this.scale,
    };
  }
}
