import { PointData, ObservablePoint, Point, Observer } from 'pixi.js';

export class Vector2D extends Point {
  static from(v: Vector2D) {
    return v.clone();
  }

  static fromJSON({ x, y }: PointData) {
    const nv = new Vector2D(x, y);
    nv.x = x;
    nv.y = y;
    return nv;
  }

  toJSON(): PointData {
    return { x: this.x, y: this.y };
  }
}

export class ObservableVector2D extends ObservablePoint {
  static from(
    v: ObservableVector2D,
    observer: Observer<ObservablePoint> | undefined = undefined
  ) {
    return v.clone(observer);
  }

  static fromJSON(observer: Observer<ObservablePoint>, { x, y }: PointData) {
    return new ObservableVector2D(observer, x, y);
  }

  toJSON(): PointData {
    return { x: this.x, y: this.y };
  }
}
