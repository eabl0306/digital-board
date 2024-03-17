import { Graphics, Text } from "pixi.js";
import { Element, ElementType } from "../../elements";
import { Fill } from "../../Fill";
import { Stroke } from "../../Stroke";
import { Context } from "../../Context";
import { InputSystem } from "../InputSystem";


export class Pointer extends Element {
    protected override type: ElementType = ElementType.POINTER;
    protected _input: InputSystem | undefined;
    protected _graphics: Graphics = new Graphics();
    protected _text: Text;
    
    protected _fill: Fill;
    protected _stroke: Stroke;
    protected _isLocal: boolean = false;
    protected _radius: number = 5;

    constructor() {
        super();

        this._text = new Text({ 
            text: 'Pointer',
            style: {
                fontSize: 10,
            }
        });
        this._fill = new Fill();
        this._stroke = new Stroke();

        this._text.anchor.set(0, 1);
        this._text.position.set(5, -5);
        this.zIndex = 1000;

        this.addChild(this._text);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.addChild(this._graphics as any);
    }

    set text(value: string) {
        this._text.text = value;
    }

    set isLocal(value: boolean) {
        this._isLocal = value;
    }

    get isLocal(): boolean {
        return this._isLocal;
    }

    override start(): void {
        super.start();
        this._input = Context.getInstance().getSystem<InputSystem>('input');
    }

    override update(delta: number): void {
        super.update(delta);

        if (this.isLocal && this._input) {
            const pp = this._input.pointerPosition();
            if (pp) this.position.set(pp.x, pp.y);
        }
    }

    override draw(): void {
        super.draw();
        this._graphics.clear();
        this._graphics.fill(this._fill.color, this._fill.opacity);
        this._graphics.stroke({
            color: this._stroke.color,
            width: this._stroke.width,
            alpha: this._stroke.opacity,
        });

        this._graphics.circle(0, 0, this._radius);
      }
}
