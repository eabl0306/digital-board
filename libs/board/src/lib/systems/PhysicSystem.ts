/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Body,
  Engine,
  Events,
  ICollisionCallback,
  IEventCollision,
  Mouse,
  Query,
  World,
} from 'matter-js';
import { Application } from 'pixi.js';
import { IScript } from '../scripts';
import { System } from './System';

type CollissionType = 'collisionStart' | 'collisionActive' | 'collisionEnd';

export class PhysicSystem implements System {
  private engine: Engine;
  private mouse: Mouse;
  private elements: [Body, IScript][] = [];
  private events: [any, (...args: any) => any][] = [];

  constructor(private app: Application) {
    this.engine = Engine.create({ gravity: { scale: 0, x: 0, y: 0 } });
    this.mouse = Mouse.create(this.app.canvas);
  }

  addBody(body: Body, element: any) {
    if (this.hasBody(body)) return;
    this.elements.push([body, element]);
    World.add(this.engine.world, [body]);
  }

  hasBody(body: Body) {
    return this.engine.world.bodies.includes(body);
  }

  removeBody(body: Body) {
    const index = this.elements.findIndex((e) => e[0] === body);

    if (index > -1) this.elements.splice(index, 1);

    World.remove(this.engine.world, body);
  }

  private dispatchCollisionEvent(
    eventName: CollissionType,
    body1: IScript,
    body2: IScript
  ) {
    switch (eventName) {
      case 'collisionStart':
        body1.onTriggerEnter(body2);
        break;
      case 'collisionActive':
        body1.onTriggerStay(body2);
        break;
      case 'collisionEnd':
        body1.onTriggerExit(body2);
        break;
    }
  }

  private onCollisionEvents(
    event: IEventCollision<Engine>,
    eventName: CollissionType
  ) {
    const pairs = event.pairs;

    // Recorrer las parejas de colisiones para encontrar colisiones para un cuerpo específico
    for (let i = 0, j = pairs.length; i != j; ++i) {
      const pair = pairs[i];

      const elementA = this.elements.find((e) => e[0] === pair.bodyA);
      const elementB = this.elements.find((e) => e[0] === pair.bodyB);

      if (elementA) {
        // 'pair.bodyB' está colisionando con 'myBody'
        this.dispatchCollisionEvent(eventName, elementA[1], elementB![1]);
      }
      if (elementB) {
        // 'pair.bodyA' está colisionando con 'myBody'
        this.dispatchCollisionEvent(eventName, elementB[1], elementA![1]);
      }
    }
  }

  onMouseEvent() {
    const position = this.mouse.position;
    const collisions = Query.point(this.engine.world.bodies, position);

    for (const collision of collisions) {
      const element = this.elements.find((e) => e[0] === collision);
      if (element) element[1].onPointerMove(this.mouse);
    }
  }

  /**
   * SYSTEM
   */

  init(): void {
    // agregamos detección de colisiones
    for (const mapEvent of [
      'collisionStart',
      'collisionActive',
      'collisionEnd',
    ] as CollissionType[]) {
      this.events.push([
        mapEvent,
        Events.on<ICollisionCallback>(this.engine, mapEvent as any, (event) =>
          this.onCollisionEvents(event, mapEvent)
        ),
      ]);
    }

    // detectamos colisiones con el mouse
    this.events.push([
      'beforeUpdate',
      Events.on(this.engine, 'beforeUpdate', () => this.onMouseEvent()),
    ]);
  }

  update(delta: number) {
    Engine.update(this.engine, delta);
  }

  destroy(): void {
    for (const event of this.events) {
      Events.off(this.engine, event[0], event[1]);
    }

    Engine.clear(this.engine);
  }
}
