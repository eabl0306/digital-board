export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  static from(v: Vector) {
    return new Vector(v.x, v.y);
  }

  static fromArray([x, y]: [number, number]) {
    return new Vector(x, y);
  }

  static fromJSON<T extends { x: number; y: number }>({ x, y }: T) {
    return new Vector(x, y);
  }

  toJSON() {
    return { x: this.x, y: this.y };
  }
}
