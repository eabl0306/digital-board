import { PointData, Transform as PixiTransform } from 'pixi.js';

export interface ITransform {
  position: PointData;
  rotation: number;
  scale: PointData;
}

export class Transform extends PixiTransform {
  static from(transform: Transform) {
    const t = new Transform();

    t.position.copyFrom(transform.position);
    t.scale.copyFrom(transform.scale);
    t.rotation = transform.rotation;

    return t;
  }

  static fromJSON({ position, rotation, scale }: ITransform) {
    const t = new Transform();

    t.position.copyFrom(position);
    t.scale.copyFrom(scale);
    t.rotation = rotation;

    return t;
  }

  toJSON(): ITransform {
    return {
      position: { x: this.position.x, y: this.position.y },
      scale: { x: this.scale.x, y: this.scale.y },
      rotation: this.rotation,
    };
  }
}
