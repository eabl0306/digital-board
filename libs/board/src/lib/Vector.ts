export interface IVector {
  x: number;
  y: number;
}

export class Vector {
  protected _x: number;
  protected _y: number;

  constructor() {
    this._x = 0;
    this._y = 0;
  }

  set x(x: number) {
    this._x = x;
  }

  get x(): number {
    return this._x;
  }

  set y(y: number) {
    this._y = y;
  }

  get y(): number {
    return this._y;
  }

  static from(v: Vector) {
    const nv = new Vector();
    nv.x = v.x;
    nv.y = v.y;
    return nv;
  }

  static fromArray([x, y]: [number, number]) {
    const nv = new Vector();
    nv.x = x;
    nv.y = y;
    return nv;
  }

  static fromJSON({ x, y }: IVector) {
    const nv = new Vector();
    nv.x = x;
    nv.y = y;
    return nv;
  }

  toJSON(): IVector {
    return { x: this.x, y: this.y };
  }
}
