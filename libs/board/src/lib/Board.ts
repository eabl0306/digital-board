import { v4 as uuid } from 'uuid';
import { Element, ElementType, IElement } from './Element';
import { Rectangle } from './Rectangle';
import { GameObject } from './GameObject';
import { Context } from './Context';

export interface IBoard {
  id: string;
  thumbnail: string | null;
  title: string;
  description: string;
  elements: IElement[];
}

export class Board implements GameObject {
  protected _id: string;
  protected _ctx: Context | undefined;
  protected _thumbnail: string | null;
  protected _title: string;
  protected _description: string;
  protected _children: Element[] = [];

  constructor(title: string, description: string) {
    this._id = uuid();
    this._thumbnail = null;
    this._title = title;
    this._description = description;
    this._children = [];
  }

  get id(): string {
    return this._id;
  }

  set ctx(ctx: Context) {
    this._ctx = ctx;
  }

  /**
   * @description Get the context
   * @warning This should only be used inside the game object flow, when using it outside it may not exist.
   */
  get ctx(): Context {
    if (!this._ctx) {
      throw new Error('Context not set');
    }

    return this._ctx;
  }

  set thumbnail(thumbnail: string | null) {
    this._thumbnail = thumbnail;
  }

  get thumbnail(): string | null {
    return this._thumbnail;
  }

  set title(title: string) {
    this._title = title;
  }

  get title(): string {
    return this._title;
  }

  set description(description: string) {
    this._description = description;
  }

  get description(): string {
    return this._description;
  }

  set children(elements: Element[]) {
    this._children = elements;
  }

  get children(): Element[] {
    return this._children;
  }

  removeChild(child: Element) {
    const index = this._children.indexOf(child);
    if (index !== -1) {
      this._children.splice(index, 1);
    }
  }

  start(): void {
    // TODO: Implement
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(delta: number): void {
    // TODO: Implement
  }

  draw(): void {
    // TODO: Implement
  }

  destroy(): void {
    // TODO: Implement
  }

  static from(board: Board) {
    const b = new Board(board.title, board.description);
    b._id = board.id;
    b.thumbnail = board.thumbnail;
    b.children = board.children.map((e) => {
      switch (e.type) {
        case ElementType.RECTANGLE:
          return Rectangle.from(e as Rectangle);
        case ElementType.EMPTY:
          return Element.from(e as Element);
      }
    });

    return b;
  }

  static fromJSON(json: IBoard) {
    const b = new Board(json.title, json.description);
    b._id = json.id;
    b.thumbnail = json.thumbnail;
    b.children = json.elements.map((e) => {
      switch (e.type) {
        case ElementType.RECTANGLE:
          return Rectangle.fromJSON(e as Rectangle);
        case ElementType.EMPTY:
          return Element.fromJSON(e as Element);
      }
    });

    return b;
  }

  toJSON(): IBoard {
    return {
      id: this._id,
      thumbnail: this._thumbnail,
      title: this._title,
      description: this._description,
      elements: this._children.map((e) => e.toJSON()),
    };
  }
}
