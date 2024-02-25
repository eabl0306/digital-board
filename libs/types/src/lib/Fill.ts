export interface IFill {
  color: string;
  opacity: number;
}

export class Fill {
  protected _color: string;
  protected _opacity: number;

  constructor() {
    this._color = '#ffffff';
    this._opacity = 1;
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
    this._opacity = Math.max(Math.min(opacity, 1), 0);
  }

  get opacity(): number {
    return this._opacity;
  }

  static from(fill: Fill) {
    const f = new Fill();

    f.color = fill.color;
    f.opacity = fill.opacity;

    return f;
  }

  static fromJSON({ color, opacity }: IFill) {
    const f = new Fill();

    f.color = color;
    f.opacity = opacity;

    return f;
  }

  toJSON(): IFill {
    return {
      color: this.color,
      opacity: this.opacity,
    };
  }
}
