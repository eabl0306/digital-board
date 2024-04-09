import { Bodies, Body } from 'matter-js';
import { Context } from '../Context';
import { Element, Rectangle } from "../elements";
import { PhysicSystem } from "../systems";
import { SYSTEM_NAME, calculateRotatePosition } from '../utilities';
import { Script } from "./Script";

export class PhysicBody extends Script {
  protected gameObject: Element;
  protected physics: PhysicSystem | undefined;
  protected body: Body | undefined;

  protected angleDistance = 0;

  constructor(parent: Element) {
    super();
    this.gameObject = parent;
    this.physics = Context.getInstance().getSystem<PhysicSystem>(SYSTEM_NAME.PHYSIC);

    if (this.physics) {
      // add body to physic system
      if (this.gameObject.getType()) {
        const rectangle = this.gameObject as Rectangle;
        this.body = Bodies.rectangle(
          rectangle.position.x,
          rectangle.position.y,
          rectangle.size.width,
          rectangle.size.height
        );
      } else {
        const bounds = this.gameObject.getBounds();
        this.body = Bodies.rectangle(
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2,
          bounds.width,
          bounds.height
        );
      }
      this.setStatic(true);
      this.physics.addBody(this.body, this.gameObject);
    } else {
      console.warn('Physic system not found');
    }
  }

  setStatic(isStatic: boolean): void {
    if (!this.body) return;
    Body.setStatic(this.body, isStatic);
  }

  setPosition(x: number, y: number, affectChildren = true) {
    if (!this.body) return;
    Body.setPosition(this.body, { x, y });

    if (!affectChildren) return;

    for (const child of this.gameObject.children) {
      if (child instanceof Element) {
        const script = child.getScript(PhysicBody);
        if (script) {
          const parentPosition = this.gameObject.getGlobalPosition();
          script.setPosition(x + parentPosition.x, y + parentPosition.y);
        }
      }
    }
  }

  setAngle(angle: number, affectChildren = true) {
    if (!this.body) return;
    Body.setAngle(this.body, angle);

    if (!affectChildren) return;

    for (const child of this.gameObject.children) {
      if (child instanceof Element) {
        const script = child.getScript(PhysicBody);
        if (script) {
          const rotate = angle - script.angleDistance;
          const position = calculateRotatePosition(this.gameObject.getGlobalPosition(), child.getGlobalPosition(), rotate);
          script.angleDistance = angle;
          script.rotate(rotate);
          script.setPosition(position.x, position.y);
        }
      }
    }
  }

  move(x: number, y: number, affectChildren = true) {
    if (!this.body) return;
    Body.translate(this.body, { x, y });

    if (!affectChildren) return;

    for (const child of this.gameObject.children) {
      if (child instanceof Element) {
        const script = child.getScript(PhysicBody);
        if (script) {
          script.move(x, y);
        }
      }
    }
  }

  rotate(rotate: number, affectChildren = true) {
    if (!this.body) return;
    Body.rotate(this.body, rotate);

    if (!affectChildren) return;

    for (const child of this.gameObject.children) {
      if (child instanceof Element) {
        const script = child.getScript(PhysicBody);
        if (script) {
          const position = calculateRotatePosition(this.gameObject.getGlobalPosition(), child.getGlobalPosition(), rotate);
          script.setPosition(position.x, position.y);
          script.rotate(rotate);
        }
      }
    }
  }

  override update(): void {
    if (!this.body) return;

    this.gameObject.setGlobalPosition(this.body.position.x, this.body.position.y);
    this.gameObject.setGlobalRotation(this.body.angle);
  }
}