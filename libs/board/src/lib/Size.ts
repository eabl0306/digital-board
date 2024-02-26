export interface ISize {
  width: number;
  height: number;
}

export class Size {
  protected _width: number;
  protected _height: number;

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
  }

  set width(width: number) {
    this._width = Math.max(width, 0);
  }

  get width(): number {
    return this._width;
  }

  set height(height: number) {
    this._height = Math.max(height, 0);
  }

  get height(): number {
    return this._height;
  }

  static from(size: Size) {
    return new Size(size.width, size.height);
  }

  static fromArray([width, height]: [number, number]) {
    return new Size(width, height);
  }

  static fromJSON({ width, height }: ISize) {
    return new Size(width, height);
  }

  toJSON(): ISize {
    return { width: this.width, height: this.height };
  }
}
