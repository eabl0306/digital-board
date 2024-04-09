import { Graphics } from 'pixi.js';
import { Fill, IFill } from '../Fill';
import { ISize, Size } from '../Size';
import { IStroke, Stroke } from '../Stroke';
import { Element, ElementType, IElement } from './Element';

export interface IRectangle extends IElement {
  fill: IFill;
  stroke: IStroke;
  size: ISize;
  radius: number;
}

export class Rectangle extends Element {
  protected override type: ElementType = ElementType.RECTANGLE;
  protected graphics: Graphics = new Graphics();

  protected _fill: Fill;
  protected _stroke: Stroke;
  protected _size: Size;
  protected _radius: number;

  constructor() {
    super();
    this._fill = new Fill();
    this._stroke = new Stroke();
    this._size = new Size(100, 100);
    this._radius = 0;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addChild(this.graphics as any);
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
    // Ensure the radius is not negative
    this._radius = Math.max(radius, 0);
  }

  get radius(): number {
    return this._radius;
  }

  override draw(): void {
    super.draw();
    this.graphics.clear();
    this.graphics.fill(this.fill.color, this.fill.opacity);
    this.graphics.stroke({
      width: this.stroke.width,
      color: this.stroke.color,
      alpha: this.stroke.opacity,
    });
    this.graphics.roundRect(
      -this.size.width / 2,
      -this.size.height / 2,
      this.size.width,
      this.size.height,
      this.radius
    );
  }

  static override from(rectangle: Rectangle) {
    const r = new Rectangle();

    r.id = rectangle.id;
    r.position.set(rectangle.position.x, rectangle.position.y);
    r.scale.set(rectangle.scale.x, rectangle.scale.y);
    r.rotation = rectangle.rotation;
    r.fill = Fill.from(rectangle.fill);
    r.stroke = Stroke.from(rectangle.stroke);
    r.size = Size.from(rectangle.size);
    r.radius = rectangle.radius;

    return r;
  }

  static override fromJSON({
    id,
    position,
    scale,
    rotation,
    fill,
    stroke,
    size,
    radius,
  }: IRectangle) {
    const r = new Rectangle();

    r.id = id;
    r.position.set(position.x, position.y);
    r.scale.set(scale.x, scale.y);
    r.rotation = rotation;
    r.fill = Fill.fromJSON(fill);
    r.stroke = Stroke.fromJSON(stroke);
    r.size = Size.fromJSON(size);
    r.radius = radius;

    return r;
  }

  override toJSON(): IRectangle {
    return {
      ...super.toJSON(),
      type: this.type,
      fill: this.fill.toJSON(),
      stroke: this.stroke.toJSON(),
      size: this.size.toJSON(),
      radius: this.radius,
    };
  }
}
