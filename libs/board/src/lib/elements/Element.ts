import { Container, PointData } from 'pixi.js';
import { Mouse } from 'matter-js';
import { v4 as uuid } from 'uuid';
import { GameObject, GameObjectEvent, GameObjectState, GameObjectStateManagement } from '../GameObject';
import { IScript } from '../scripts';
import { getGlobalRotation } from '../utilities';

export enum ElementType {
  EMPTY = 'EMPTY',
  RECTANGLE = 'RECTANGLE',
  POINTER = 'POINTER',
}

export interface IElement {
  type: ElementType;
  id: string;
  position: PointData;
  scale: PointData;
  rotation: number;
  children: IElement[];
}

export class Element extends Container implements GameObject, GameObjectStateManagement, GameObjectEvent {
  protected type: ElementType = ElementType.EMPTY;
  protected state: GameObjectState = GameObjectState.START;
  protected scripts: IScript[] = [];

  public id: string = uuid();

  getType(): ElementType {
    return this.type;
  }

  setState(state: GameObjectState): void {
    if (state === this.state) return;
    if (state === GameObjectState.INACTIVE && [GameObjectState.DESTROY, GameObjectState.DESTROYED].includes(this.state)) return;

    if ([GameObjectState.INACTIVE, GameObjectState.DESTROY].includes(state)) {
      for (const element of this.children) {
        if (element instanceof Element) {
          element.setState(GameObjectState.DESTROY);
        }
      }
    }

    if (state === GameObjectState.INACTIVE) this.onInactive();
    if (this.state === GameObjectState.INACTIVE && ![GameObjectState.DESTROY, GameObjectState.DESTROYED].includes(state)) this.onActive();

    this.state = state;
  }

  getState(): GameObjectState {
    return this.state;
  }

  addScript(script: IScript): void {
    this.scripts.push(script);
  }

  getScript<T extends IScript>(type: new (...args: any[]) => T): T | undefined {
    return this.scripts.find((s) => s instanceof type) as T;
  }

  getScripts<T extends IScript>(type: new () => T): T[] {
    return this.scripts.filter((s) => s instanceof type) as T[];
  }

  removeScripts<T extends IScript>(type: new () => T): void {
    this.scripts = this.scripts.filter((s) => !(s instanceof type));
  }

  setGlobalPosition(x: number, y: number): void {
    const parentPosition = this.parent ? this.parent.getGlobalPosition() : { x: 0, y: 0 };
    const parentRotation = this.parent ? getGlobalRotation(this.parent) : 0;
    const dx = x - parentPosition.x;
    const dy = y - parentPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    this.position.set(distance * Math.cos(angle - parentRotation), distance * Math.sin(angle - parentRotation));
  }

  getGlobalRotation(): number {
    return getGlobalRotation(this);
  }

  setGlobalRotation(rotation: number): void {
    const parentRotation = this.parent ? getGlobalRotation(this.parent) : 0;
    this.rotation = rotation - parentRotation;
  }

  onActive() {
    for (const script of this.scripts) {
      script.onActive();
    }
  }

  onInactive() {
    for (const script of this.scripts) {
      script.onInactive();
    }
  }

  onPointerMove(mouse: Mouse): void {
    for (const script of this.scripts) {
      script.onPointerMove(mouse);
    }
  }

  onTriggerEnter(other: any): void {
    for (const script of this.scripts) {
      script.onTriggerEnter(other);
    }
  }

  onTriggerExit(other: any): void {
    for (const script of this.scripts) {
      script.onTriggerExit(other);
    }
  }

  onTriggerStay(other: any): void {
    for (const script of this.scripts) {
      script.onTriggerStay(other);
    }
  }

  onWsConnect(ws: WebSocket): void {
    for (const script of this.scripts) {
      script.onWsConnect(ws);
    }
  }

  onWsMessage(ev: MessageEvent): void {
    for (const script of this.scripts) {
      script.onWsMessage(ev);
    }
  }

  onWsClose(): void {
    for (const script of this.scripts) {
      script.onWsClose();
    }
  }

  start(): void {
    for (const script of this.scripts) {
      script.start();
    }
  }

  update(delta: number): void {
    for (const script of this.scripts) {
      script.update(delta);
    }
  }

  draw(): void {
    for (const script of this.scripts) {
      script.draw();
    }
  }

  override destroy(): void {
    for (const script of this.scripts) {
      script.destroy();
    }

    super.destroy();
  }

  static from(empty: Element) {
    const e = new Element();

    e.id = empty.id;
    e.position.set(empty.position.x, empty.position.y);
    e.scale.set(empty.scale.x, empty.scale.y);
    e.rotation = empty.rotation;
    if (empty.children.length > 0) e.addChild(...empty.children.map((c) => Element.from(c as Element)));

    return e;
  }

  static fromJSON(json: Omit<IElement, 'type'>) {
    const e = new Element();

    e.id = json.id;
    e.position.set(json.position.x, json.position.y);
    e.scale.set(json.scale.x, json.scale.y);
    e.rotation = json.rotation;
    e.addChild(
      ...json.children
        .filter((it) => it instanceof Element)
        .map((c) => Element.fromJSON(c))
    );

    return e;
  }

  toJSON(): IElement {
    return {
      type: this.type,
      id: this.id,
      position: { x: this.position.x, y: this.position.y },
      scale: { x: this.scale.x, y: this.scale.y },
      rotation: this.rotation,
      children: this.children
        .filter((it) => it instanceof Element)
        .map((c) => (c as Element).toJSON()),
    };
  }
}
