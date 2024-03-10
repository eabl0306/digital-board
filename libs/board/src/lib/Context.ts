import { Application } from 'pixi.js';
import { v4 as uuid } from 'uuid';
import { Vector2D } from './Vector';
import { InputSystem } from './InputSystem';
import { System } from './System';

class UserInfo {
  public readonly pointer: Vector2D = new Vector2D();

  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly isLocal: boolean
  ) {}
}

export class Context {
  private static _instance: Context;

  public readonly localUser: UserInfo;
  public readonly remoteUsers: UserInfo[] = [];

  public readonly systems: Record<string, System> = {};

  constructor(public readonly app: Application) {
    this.localUser = new UserInfo(uuid(), 'local', true);
    this.addSystem('input', new InputSystem(this.app));

    Context._instance = this;
  }

  static getInstance(app: Application | null = null) {
    if (Context._instance) return Context._instance;
    if (!app) throw new Error('Context not initialized');

    return new Context(app);
  }

  addUser(id: string, name: string) {
    this.remoteUsers.push(new UserInfo(id, name, false));
  }

  removeUser(id: string) {
    const index = this.remoteUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      this.remoteUsers.splice(index, 1);
    }
  }

  addSystem(name: string, system: System) {
    if (this.systems[name]) {
      throw new Error(`System with name ${name} already exists`);
    }

    this.systems[name] = system;
  }

  getSystem<T extends System>(name: string): T {
    return this.systems[name] as T;
  }

  removeSystem(name: string) {
    this.systems[name].destroy();
    delete this.systems[name];
  }

  init() {
    this.getSystem<InputSystem>('input').on(
      'pointermove',
      (event: { data: { global: { x: number; y: number } } }) => {
        this.localUser.pointer.set(event.data.global.x, event.data.global.y);
      }
    );

    for (const system in this.systems) {
      this.systems[system].init();
    }
  }

  update(delta: number) {
    for (const system in this.systems) {
      this.systems[system].update(delta);
    }
  }

  destroy() {
    for (const system in this.systems) {
      this.systems[system].destroy();
    }
  }
}
