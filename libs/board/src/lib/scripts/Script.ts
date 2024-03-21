import { Mouse } from "matter-js";
import { GameObject, GameObjectEvent } from "../GameObject";

export type IScript = GameObject & GameObjectEvent;

export abstract class Script implements IScript {
  start(): void {}

  update(delta: number): void {}

  draw(): void {}

  destroy(): void {}
  
  onActive(): void {}
  
  onInactive(): void {}
  
  onHover(mouse: Mouse): void {}
  
  onTriggerEnter(other: any): void {}
  
  onTriggerExit(other: any): void {}
  
  onTriggerStay(other: any): void {}
}
