export class Fill {
  protected _color: string;
  protected _opacity: number;

  constructor(color = '#000000', opacity = 1) {
    this._color = color;
    this._opacity = opacity;
  }

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

  static from(fill: Fill) {
    const f = new Fill();

    f.color = fill.color;
    f.opacity = fill.opacity;

    return f;
  }

  static fromJSON({ color, opacity }: { color: string; opacity: number }) {
    const f = new Fill();

    f.color = color;
    f.opacity = opacity;

    return f;
  }

  toJSON() {
    return {
      color: this.color,
      opacity: this.opacity,
    };
  }
}
