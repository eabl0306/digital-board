import { Mouse } from "matter-js";
import { GameObject, GameObjectEvent } from "../GameObject";

export type IScript = GameObject & GameObjectEvent;

export abstract class Script implements IScript {
  // -------------------------------------------------------------------------
  // life cycle
  // -------------------------------------------------------------------------
  
  start(): void {}

  update(delta: number): void {}

  draw(): void {}

  destroy(): void {}
  
  onActive(): void {}
  
  onInactive(): void {}
  
  // -------------------------------------------------------------------------
  // Pointer events
  // -------------------------------------------------------------------------

  onPointerMove(mouse: Mouse): void {}

  // -------------------------------------------------------------------------
  // Collision events
  // -------------------------------------------------------------------------
  
  onTriggerEnter(other: any): void {}
  
  onTriggerExit(other: any): void {}
  
  onTriggerStay(other: any): void {}

  // -------------------------------------------------------------------------
  // Connection events
  // -------------------------------------------------------------------------

  onWsConnect(ws: WebSocket): void {}

  onWsMessage(ev: MessageEvent): void {}

  onWsClose(): void {}
}
