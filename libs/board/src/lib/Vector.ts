import { IPointData, ObservablePoint, Point } from 'pixi.js';

export class Vector2D extends Point {
  static from(v: Vector2D) {
    return v.clone();
  }

  static fromJSON({ x, y }: IPointData) {
    const nv = new Vector2D(x, y);
    nv.x = x;
    nv.y = y;
    return nv;
  }

  toJSON(): IPointData {
    return { x: this.x, y: this.y };
  }
}

export class ObservableVector2D<T> extends ObservablePoint<T> {
  static from<T>(v: ObservableVector2D<T>, cb: (this: T) => unknown, scope: T) {
    return v.clone(cb, scope);
  }

  static fromJSON<T>({ x, y }: IPointData, cb: (this: T) => unknown, scope: T) {
    return new ObservableVector2D(cb, scope, x, y);
  }

  toJSON(): IPointData {
    return { x: this.x, y: this.y };
  }
}
