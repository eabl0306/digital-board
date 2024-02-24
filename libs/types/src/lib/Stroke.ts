export class Stroke {
  protected _color: string = '#ffffff';
  protected _opacity: number = 1;
  protected _width: number = 1;

  set color(color: string) {
    this._color = color;
  }

  get color(): string {
    return this._color;
  }

  set opacity(opacity: number) {
    this._opacity = Math.max(Math.min(opacity, 1), 0);
  }

  get opacity(): number {
    return this._opacity;
  }

  set width(width: number) {
    this._width = Math.max(width, 0);
  }

  get width(): number {
    return this._width;
  }

  static from(stroke: Stroke) {
    const s = new Stroke();

    s.color = stroke.color;
    s.opacity = stroke.opacity;
    s.width = stroke.width;

    return s;
  }

  static fromJSON({
    color,
    opacity,
    width,
  }: {
    color: string;
    opacity: number;
    width: number;
  }) {
    const s = new Stroke();

    s.color = color;
    s.opacity = opacity;
    s.width = width;

    return s;
  }

  toJSON() {
    return {
      color: this.color,
      opacity: this.opacity,
      width: this.width,
    };
  }
}
