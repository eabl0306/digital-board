import { Graphics } from 'pixi.js';
import { Element, ElementType, IElement } from './Element';
import { Fill, IFill } from './Fill';
import { IStroke, Stroke } from './Stroke';
import { ISize, Size } from './Size';
import { Transform } from './Transform';

export interface IRectangle extends IElement {
  fill: IFill;
  stroke: IStroke;
  size: ISize;
  radius: number;
}

export class Rectangle extends Element {
  public override readonly type: ElementType = ElementType.RECTANGLE;
  public readonly graphics: Graphics = new Graphics();

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

  override start(): void {
    this.ctx.app.stage.addChild(this.graphics);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override update(delta: number): void {
    this.graphics.position.set(
      this.transform.position.x,
      this.transform.position.y
    );
    this.graphics.rotation = this.transform.rotation;
    this.graphics.scale.set(this.transform.scale, this.transform.scale);
  }

  override draw(): void {
    this.graphics.clear();
    this.graphics.beginFill(this.fill.color, this.fill.opacity);
    this.graphics.lineStyle(
      this.stroke.width,
      this.stroke.color,
      this.stroke.opacity
    );
    this.graphics.drawRoundedRect(
      0,
      0,
      this.size.width,
      this.size.height,
      this.radius
    );
    this.graphics.endFill();
  }

  static override from(rectangle: Rectangle) {
    const r = new Rectangle();

    r._id = rectangle.id;
    r._transform = Transform.from(rectangle.transform);
    r.fill = Fill.from(rectangle.fill);
    r.stroke = Stroke.from(rectangle.stroke);
    r.size = Size.from(rectangle.size);
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
  }: IRectangle) {
    const r = new Rectangle();

    r._id = id;
    r._transform = Transform.fromJSON(transform);
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
