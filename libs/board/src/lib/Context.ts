import { Application } from 'pixi.js';
import { v4 as uuid } from 'uuid';
import { Board } from './Board';
import { Vector2D } from './Vector';

class UserInfo {
  public readonly pointer: Vector2D = new Vector2D();

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isLocal: boolean
  ) {}
}

export class Context {
  public readonly remoteUsers: UserInfo[] = [];

  public readonly localUser: UserInfo;

  constructor(public readonly app: Application, public readonly board: Board) {
    this.localUser = new UserInfo(uuid(), 'local', true);
  }

  addRemoteUser(id: string, name: string) {
    this.remoteUsers.push(new UserInfo(id, name, false));
  }

  removeRemoteUser(id: string) {
    const index = this.remoteUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.remoteUsers.splice(index, 1);
    }
  }
}
