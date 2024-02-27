import { Application } from 'pixi.js';
import { Board } from './Board';

export class Context {
  constructor(public readonly app: Application, public readonly board: Board) {}
}
