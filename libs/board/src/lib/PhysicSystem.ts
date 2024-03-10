/* eslint-disable @typescript-eslint/no-explicit-any */
import { Body, World, Engine, Mouse, MouseConstraint } from 'matter-js';
import { System } from './System';

export class PhysicSystem implements System {
  private engine: Engine;

  constructor(private app: any) {
    this.engine = Engine.create();
  }

  addBody(body: Body) {
    World.add(this.engine.world, [body]);
  }

  hasBody(body: Body) {
    return this.engine.world.bodies.includes(body);
  }

  removeBody(body: Body) {
    World.remove(this.engine.world, body);
  }

  /**
   * SYSTEM
   */

  init(): void {
    // add mouse control
    const mouse = Mouse.create(this.app.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });
    World.add(this.engine.world, mouseConstraint);
  }

  update(delta: number) {
    Engine.update(this.engine, delta);
  }

  destroy(): void {
    Engine.clear(this.engine);
  }
}
