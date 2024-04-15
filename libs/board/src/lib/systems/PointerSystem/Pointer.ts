import { Assets, Sprite, Text } from 'pixi.js';
import { Context } from '../../Context';
import { Element, ElementType } from '../../elements';
import { SYSTEM_NAME } from '../../utilities';
import { InputSystem } from '../InputSystem';

export class Pointer extends Element {
  protected override type: ElementType = ElementType.POINTER;
  protected _input: InputSystem | undefined;
  protected _text: Text;
  protected _sprite: Sprite | undefined;

  protected _isLocal = false;

  constructor() {
    super();

    this._text = new Text({
      text: 'Pointer',
      style: {
        fontSize: 10,
      },
    });

    this._text.anchor.set(0, 1);
    this._text.position.set(5, -5);

    Assets.load('/assets/cursor_pointerFlat_shadow.png').then((texture) => {
      this._sprite = new Sprite(texture);
      this._sprite.anchor.set(0.075, 0.075);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.addChild(this._sprite);
    });

    this.zIndex = 1000;

    this.addChild(this._text);
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
    this._input = Context.getInstance().getSystem<InputSystem>(
      SYSTEM_NAME.INPUT
    );
  }

  override update(delta: number): void {
    super.update(delta);

    if (this.isLocal && this._input) {
      const pp = this._input.pointerPosition();
      if (pp) this.position.set(pp.x, pp.y);
    }
  }

  override destroy(): void {
    super.destroy();

    this.removeChild(this._text);
    if (this._sprite) this.removeChild(this._sprite);
  }
}
