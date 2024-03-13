/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, World, Engine, Events, ICollisionCallback, Mouse, Query } from 'matter-js';
import { System } from './System';

interface ICollisionMap {
  type: string;
  method: string;
  cb?: ICollisionCallback;
}

export class PhysicSystem implements System {
  private engine: Engine;
  private mouse: Mouse;
  private elements: [Body, any][] = [];
  private mapEvents: ICollisionMap[] = [
    { type: 'collisionStart', method: 'onTriggerEnter' },
    { type: 'collisionActive', method: 'onTriggerStay' },
    { type: 'collisionEnd', method: 'onTriggerExit' },
  ];

  constructor(private app: any) {
    this.engine = Engine.create({
      gravity: { scale: 0, x: 0, y: 0 },
    });
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

  /**
   * SYSTEM
   */

  init(): void {
    // agregamos detección de colisiones
    for (const mapEvent of this.mapEvents) {
      mapEvent.cb = Events.on<ICollisionCallback>(this.engine, mapEvent.type as any, (event) => {
        let pairs = event.pairs;
    
        // Recorrer las parejas de colisiones para encontrar colisiones para un cuerpo específico
        for (let i = 0, j = pairs.length; i != j; ++i) {
          var pair = pairs[i];
  
          const elementA = this.elements.find((e) => e[0] === pair.bodyA);
          const elementB = this.elements.find((e) => e[0] === pair.bodyB);
          
          if (elementA) {
            // 'pair.bodyB' está colisionando con 'myBody'
            elementA[1][mapEvent.method](elementB as any);
          }
          if (elementB) {
            // 'pair.bodyA' está colisionando con 'myBody'
            elementB[1][mapEvent.method](elementA as any);
          }
        }
      });
    }

    // detectamos colisiones con el mouse
    Events.on(this.engine, 'beforeUpdate', (event) => {
      const position = this.mouse.position;
      const collisions = Query.point(this.engine.world.bodies, position);

      for (const collision of collisions) {
        const element = this.elements.find((e) => e[0] === collision);
        if (!element) continue;

        element[1].onHover(this.mouse);
      }
    })
  }

  update(delta: number) {
    Engine.update(this.engine, delta);
  }

  destroy(): void {
    for (const mapEvent of this.mapEvents) {
      if (!mapEvent.cb) continue;
      Events.off(this.engine, mapEvent.type as any, mapEvent.cb);
    }

    Engine.clear(this.engine);
  }
}
