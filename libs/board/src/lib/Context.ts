import { Application } from 'pixi.js';
import { System } from './systems';

export class Context {
  private static _instance: Context;

  public readonly systems: Record<string, System> = {};

  constructor(public readonly app: Application) {
    Context._instance = this;
  }

  static getInstance(app: Application | null = null) {
    if (Context._instance) return Context._instance;
    if (!app) throw new Error('Context not initialized');

    return new Context(app);
  }

  addSystem(name: string, system: System) {
    if (this.systems[name]) {
      throw new Error(`System with name ${name} already exists`);
    }

    this.systems[name] = system;
  }

  getSystem<T extends System>(name: string): T | undefined {
    return this.systems[name] as T;
  }

  removeSystem(name: string) {
    this.systems[name].destroy();
    delete this.systems[name];
  }

  init() {
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
