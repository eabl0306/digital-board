import { PointData } from 'pixi.js';
import { Context } from '../Context';
import { Element } from '../elements';
import { SyncronizationSystem } from '../systems';
import { SERVER_COMMANDS, SYSTEM_NAME, getGlobalRotation } from '../utilities';
import { PhysicBody } from './PhysicBody';
import { Script } from './Script';

export class SyncronizeElement extends Script {
  protected gameObject: Element;
  protected syncronization: SyncronizationSystem;
  protected physicBody: PhysicBody | undefined;

  protected lock: boolean = false;
  protected position: PointData = { x: 0, y: 0 };
  protected rotation: number = 0;

  constructor(parent: Element) {
    super();
    this.gameObject = parent;
    this.syncronization = Context.getInstance().getSystem<SyncronizationSystem>(SYSTEM_NAME.SYNCRONIZATION)!;
    this.physicBody = this.gameObject.getScript(PhysicBody);

    this.syncronization.addScript(this);
  }

  setPhysicBody(physicBody: PhysicBody) {
    this.physicBody = physicBody;
  }

  override onWsMessage(ev: MessageEvent<any>): void {
    const [cmd, id, ...args] = ev.data.split(' ');

    if (id !== this.gameObject.id) return;

    if (cmd === SERVER_COMMANDS.ELEMENT_POSITION_UPDATE) {
      const [x, y] = args;

      this.lock = true;
      this.position.x = Number(x);
      this.position.y = Number(y);

      if (this.physicBody) {
        this.physicBody.setPosition(this.position.x, this.position.y, false);
      } else {
        this.gameObject.setGlobalPosition(this.position.x, this.position.y);
      }
    } else if (cmd === SERVER_COMMANDS.ELEMENT_ROTATION_UPDATE) {

      const [rotation] = args;

      this.lock = true;
      this.rotation = Number(rotation);

      if (this.physicBody) {
        this.physicBody.setAngle(this.rotation, false);
      } else {
        this.gameObject.setGlobalRotation(this.rotation);
      }
    }

    this.lock = false;
  }

  override update(delta: number): void {
    const position = this.gameObject.getGlobalPosition();
    const rotation = getGlobalRotation(this.gameObject);

    if (!this.lock) {
      if (this.position.x !== position.x || this.position.y !== position.y) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.syncronization.send(`${SERVER_COMMANDS.ELEMENT_POSITION_UPDATE} ${this.gameObject.id} ${position.x} ${position.y}`);
      }

      if (this.rotation !== rotation) {
        this.rotation = rotation;
        this.syncronization.send(`${SERVER_COMMANDS.ELEMENT_ROTATION_UPDATE} ${this.gameObject.id} ${rotation}`);
      }
    }
  }
}
