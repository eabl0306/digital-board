import { Element, ElementType } from './Element';
import { Fill } from './Fill';
import { Stroke } from './Stroke';
import { Size } from './Size';
import { Transform } from './Transform';

export class Rectangle extends Element {
  public override readonly type: ElementType = ElementType.RECTANGLE;

  protected _fill: Fill;
  protected _stroke: Stroke;
  protected _size: Size;
  protected _radius: number = 0;

  constructor(size: Size) {
    super();
    this._fill = new Fill();
    this._stroke = new Stroke();
    this._size = size;
  }

  set fill(fill: Fill) {
    this._fill = fill;
  }

  get fill(): Fill {
    return this._fill;
  }

  set stroke(stroke: Stroke) {
    this._stroke = stroke;
  }

  get stroke(): Stroke {
    return this._stroke;
  }

  set size(size: Size) {
    this._size = size;
  }

  get size(): Size {
    return this._size;
  }

  set radius(radius: number) {
    this._radius = Math.max(radius, 0);
  }

  get radius(): number {
    return this._radius;
  }

  static override from(rectangle: Rectangle) {
    const r = new Rectangle(Size.from(rectangle.size));

    r._id = rectangle.id;
    r._transform = Transform.from(rectangle.transform);
    r.fill = Fill.from(rectangle.fill);
    r.stroke = Stroke.from(rectangle.stroke);
    r.radius = rectangle.radius;

    return r;
  }

  static override fromJSON({
    id,
    transform,
    fill,
    stroke,
    size,
    radius,
  }: Pick<
    Rectangle,
    'id' | 'transform' | 'fill' | 'stroke' | 'size' | 'radius'
  >) {
    const r = new Rectangle(Size.fromJSON(size));

    r._id = id;
    r._transform = Transform.fromJSON(transform);
    r.fill = Fill.fromJSON(fill);
    r.stroke = Stroke.fromJSON(stroke);
    r.radius = radius;

    return r;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      fill: this.fill.toJSON(),
      stroke: this.stroke.toJSON(),
      size: this.size.toJSON(),
      radius: this.radius,
    };
  }
}
