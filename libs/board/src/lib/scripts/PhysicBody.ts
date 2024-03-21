import { Bodies, Body, Mouse, Vector } from 'matter-js';
import { Element, ElementType, Rectangle } from "../elements";
import { PhysicSystem } from "../systems";
import { Script } from "./Script";
import { Context } from '../Context';
import { calculateRotatePosition } from '../utilities';

export class PhysicBody extends Script {
  protected gameObject: Element;
  protected physics: PhysicSystem;
  protected body: Body;

  protected angleDistance: number = 0;

  constructor(parent: Element) {
    super();
    this.gameObject = parent;
    this.physics = Context.getInstance().getSystem<PhysicSystem>('physic');

    // add body to physic system
    switch (this.gameObject.getType()) {
      case ElementType.RECTANGLE:
        const rectangle = this.gameObject as Rectangle;
        this.body = Bodies.rectangle(
          rectangle.position.x,
          rectangle.position.y,
          rectangle.size.width,
          rectangle.size.height
        );
        break;
      default:
        const bounds = this.gameObject.getBounds();
        this.body = Bodies.rectangle(
          bounds.x + bounds.width / 2,
          bounds.y + bounds.height / 2,
          bounds.width,
          bounds.height
        );
        break;
    }
    this.setStatic(true);

    this.physics.addBody(this.body, this.gameObject);
  }

  setStatic(isStatic: boolean): void {
    Body.setStatic(this.body, isStatic);
  }

  setPosition(x: number, y: number) {
    Body.setPosition(this.body, { x, y });

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

  move(x: number, y: number) {
    Body.translate(this.body, { x, y });

    for (const child of this.gameObject.children) {
      if (child instanceof Element) {
        const script = child.getScript(PhysicBody);
        if (script) {
          script.move(x, y);
        }
      }
    }
  }

  setAngle(angle: number) {
    Body.setAngle(this.body, angle);

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

  rotate(rotate: number) {
    Body.rotate(this.body, rotate);

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

  override onHover(mouse: Mouse): void {
    // set angle to mouse
    const position = this.gameObject.getGlobalPosition();
    const angle = Vector.angle(position, mouse.position);
    this.setAngle(angle);
  }

  override update(delta: number): void {
    this.gameObject.setGlobalPosition(this.body.position.x, this.body.position.y);
    this.gameObject.setGlobalRotation(this.body.angle);
  }
}