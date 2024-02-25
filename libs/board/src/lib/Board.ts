import { Board as TBoard } from '@front-monorepo/types';
import { GameObject } from './GameObject';
import { Element } from './Element';

export class Board extends TBoard implements GameObject {
  protected override _children: Element[];

  constructor(title: string, description: string) {
    super(title, description);
    this._children = [];
  }

  override set children(elements: Element[]) {
    this._children = elements;
  }

  override get children(): Element[] {
    return this._children;
  }

  start(): void {
    // TODO: Implement
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
    // TODO: Implement
  }

  destroy(): void {
    // TODO: Implement
  }
}
