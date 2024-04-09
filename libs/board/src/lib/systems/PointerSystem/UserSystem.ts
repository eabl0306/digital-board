/* eslint-disable @typescript-eslint/no-explicit-any */
import { PointData } from 'pixi.js';
import { Board } from '../../Board';
import { SyncronizeElement } from '../../scripts';
import { SyncronizationSystem } from '../SynchronizationSystem';
import { System } from '../System';
import { Pointer } from './Pointer';
import { SERVER_COMMANDS, SYSTEM_NAME } from '../../utilities';
import { Context } from '../../Context';

interface User {
  id: string;
  name: string;
  pointer: Pointer;
}

export class UserSystem implements System {
  protected syncronization: SyncronizationSystem | undefined;
  protected users: User[];
  protected localPosition: PointData = { x: 0, y: 0 };

  constructor(private board: Board) {
    this.syncronization = Context.getInstance().getSystem<SyncronizationSystem>(SYSTEM_NAME.SYNCRONIZATION);
    this.users = [{
      id: '',
      name: 'Local',
      pointer: new Pointer(),
    }];

    this.users[0].pointer.isLocal = true;
    this.users[0].pointer.addScript(new SyncronizeElement(this.users[0].pointer));
    
    board.addChild(this.users[0].pointer);
  }

  onMessage(ev: MessageEvent) {
    if (ev.data.startsWith(SERVER_COMMANDS.USER_CONNECTED)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, id] = ev.data.split(' ');

      this.users[0].id = id;
      this.users[0].pointer.id = id;

      if (this.syncronization) this.syncronization.send('/join test-room');
    } else if (ev.data.startsWith(SERVER_COMMANDS.USER_LIST)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, ...ids] = ev.data.split(' ');

      for (const id of ids) {
        const user = this.users.find((user) => user.id === id);
        if (!user) {
          const pointer = new Pointer();
          pointer.id = id;
          pointer.text = 'Remote';

          pointer.addScript(new SyncronizeElement(pointer));

          this.users.push({ id, name: 'Remote', pointer });
          this.board.addChild(pointer);
        }
      }
    } else if (ev.data.startsWith(SERVER_COMMANDS.USER_REMOVE)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, id] = ev.data.split(' ');

      const user = this.users.find((user) => user.id === id);
      if (user) {
        this.board.removeChild(user.pointer);
        this.users = this.users.filter((user) => user.id !== id);
      }
    }
  }

  /**
   * SYSTEM
   */

  init(): void {
    if (this.syncronization) this.syncronization.addListener('onMessage', (ev) => this.onMessage(ev))
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(_delta: number): void {
    // TODO: Implement update method
  }

  destroy(): void {
    // TODO: Implement destroy method
  }
}
