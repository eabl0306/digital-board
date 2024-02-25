export interface IStroke {
  color: string;
  opacity: number;
  width: number;
}

export class Stroke {
  protected _color: string;
  protected _opacity: number;
  protected _width: number;

  constructor() {
    this._color = '#ffffff';
    this._opacity = 1;
    this._width = 1;
  }

  set color(color: string) {
    // Ensure the color is a valid hex color
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      throw new Error('Invalid color');
    }

    this._color = color;
  }

  get color(): string {
    return this._color;
  }

  set opacity(opacity: number) {
    // Ensure the opacity is between 0 and 1
    this._opacity = Math.max(Math.min(opacity, 1), 0);
  }

  get opacity(): number {
    return this._opacity;
  }

  set width(width: number) {
    // Ensure the width is not negative
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

  static fromJSON({ color, opacity, width }: IStroke) {
    const s = new Stroke();

    s.color = color;
    s.opacity = opacity;
    s.width = width;

    return s;
  }

  toJSON(): IStroke {
    return {
      color: this.color,
      opacity: this.opacity,
      width: this.width,
    };
  }
}
