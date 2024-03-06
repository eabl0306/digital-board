/* eslint-disable @typescript-eslint/no-explicit-any */
import { System } from './System';
import { Vector2D } from './Vector';

export enum InputState {
  NONE,
  DOWN,
  PRESS,
  UP,
}

export interface InputButton {
  state: InputState;
}

export enum InputPointerButton {
  NONE,
  LEFT,
  MIDDLE,
  RIGHT,
}

export interface InputPointer extends InputButton {
  button: InputPointerButton;
  position: Vector2D;
  positionStart: Vector2D;
  positionEnd: Vector2D;
}

export interface InputSystemState {
  pointer: InputPointer;
}

function defaultInputPointer(): InputPointer {
  return {
    state: InputState.NONE,
    button: InputPointerButton.NONE,
    position: new Vector2D(),
    positionStart: new Vector2D(),
    positionEnd: new Vector2D(),
  };
}

export class InputSystem implements System {
  private state: InputSystemState = {
    pointer: defaultInputPointer(),
  };

  private handlers: Record<string, ((event: any) => void)[]> = {
    pointerdown: [],
    pointerup: [],
    pointermove: [],
  };

  private eventTimer = 0;
  private eventInterval = 1 / 60;

  constructor(private app: any) {}

  pointerState(): InputState {
    return this.state.pointer.state;
  }

  pointerButton(): InputPointerButton {
    return this.state.pointer.button;
  }

  pointerPosition(): Vector2D | null {
    return this.state.pointer.position;
  }

  pointerPositionStart(): Vector2D | null {
    if (this.state.pointer.button === InputPointerButton.NONE) return null;
    return this.state.pointer.positionStart;
  }

  pointerPositionEnd(): Vector2D | null {
    if (this.state.pointer.button === InputPointerButton.NONE) return null;
    return this.state.pointer.positionEnd;
  }

  on(event: string, handler: (event: any) => void) {
    if (this.handlers[event]) {
      this.handlers[event].push(handler);
    }
  }

  /**
   * EVENTS
   */

  onPointerDown(event: any) {
    this.eventTimer = 0;
    switch (event.data.button) {
      case 0:
        this.state.pointer.button = InputPointerButton.LEFT;
        break;
      case 1:
        this.state.pointer.button = InputPointerButton.MIDDLE;
        break;
      case 2:
        this.state.pointer.button = InputPointerButton.RIGHT;
        break;
      default:
        this.state.pointer.button = InputPointerButton.NONE;
    }

    this.state.pointer.state = InputState.DOWN;
    this.state.pointer.positionStart.set(
      event.data.global.x,
      event.data.global.y
    );

    this.handlers['pointerdown'].forEach((handler) => handler(event));
  }

  onPointerUp(event: any) {
    this.eventTimer = 0;
    this.state.pointer.state = InputState.UP;
    this.state.pointer.positionEnd.set(
      event.data.global.x,
      event.data.global.y
    );

    this.handlers['pointerup'].forEach((handler) => handler(event));
  }

  onPointerMove(event: any) {
    this.state.pointer.position.set(event.data.global.x, event.data.global.y);

    this.handlers['pointermove'].forEach((handler) => handler(event));
  }

  /**
   * SYSTEM
   */

  init(): void {
    this.eventInterval = 0.8 / this.app.ticker.maxFPS;
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on('pointerdown', this.onPointerDown.bind(this));
    this.app.stage.on('pointerup', this.onPointerUp.bind(this));
    this.app.stage.on('pointerupoutside', this.onPointerUp.bind(this));
    this.app.stage.on('pointermove', this.onPointerMove.bind(this));
  }

  update(delta: number) {
    const state = this.pointerState();
    if (state === InputState.DOWN && this.eventTimer > this.eventInterval) {
      this.state.pointer.state = InputState.PRESS;
    }
    if (state === InputState.UP && this.eventTimer > this.eventInterval) {
      this.state.pointer.state = InputState.NONE;
      this.state.pointer.button = InputPointerButton.NONE;
    }
    this.eventTimer += delta / this.app.ticker.maxFPS;
  }

  destroy(): void {
    this.app.stage.off('pointerdown');
    this.app.stage.off('pointerup');
    this.app.stage.off('pointerupoutside');
    this.app.stage.off('pointermove');
  }
}
