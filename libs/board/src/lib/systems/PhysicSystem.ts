/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, World, Engine, Events, ICollisionCallback } from 'matter-js';
import { System } from './System';

const mapEvents = [
  ['collisionStart', 'onTriggerEnter'], 
  ['collisionActive', 'onTriggerStay'], 
  ['collisionEnd', 'onTriggerExit']
];

export class PhysicSystem implements System {
  private engine: Engine;
  private elements: [Body, any][] = [];

  constructor(private app: any) {
    this.engine = Engine.create({
      gravity: { scale: 0, x: 0, y: 0 },
    });
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
    // add mouse control
    for (const mapEvent of mapEvents) {
      Events.on<ICollisionCallback>(this.engine, mapEvent[0] as any, (event) => {
        let pairs = event.pairs;
    
        // Recorrer las parejas de colisiones para encontrar colisiones para un cuerpo específico
        for (let i = 0, j = pairs.length; i != j; ++i) {
          var pair = pairs[i];
  
          const elementA = this.elements.find((e) => e[0] === pair.bodyA);
          const elementB = this.elements.find((e) => e[0] === pair.bodyB);
          
          if (elementA) {
            // 'pair.bodyB' está colisionando con 'myBody'
            elementA[1][mapEvent[1]](elementB as any);
          }
          if (elementB) {
            // 'pair.bodyA' está colisionando con 'myBody'
            elementB[1][mapEvent[1]](elementA as any);
          }
        }
      });
    }
  }

  update(delta: number) {
    Engine.update(this.engine, delta);
  }

  destroy(): void {
    Engine.clear(this.engine);
  }
}
