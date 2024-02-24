import { v4 as uuid } from 'uuid';
import { Element } from './Element';
import { Rectangle } from './Rectangle';

export type Elements = Element | Rectangle;

export class Board {
  protected _id: string;
  protected _thumbnail: string | null;
  protected _title: string;
  protected _description: string;
  protected _elements: Elements[] = [];

  constructor(title: string, description: string) {
    this._id = uuid();
    this._thumbnail = null;
    this._title = title;
    this._description = description;
    this._elements = [];
  }

  set id(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
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

  set elements(elements: Elements[]) {
    this._elements = elements;
  }

  get elements(): Elements[] {
    return this._elements;
  }

  static from(board: Board) {
    const b = new Board(board.title, board.description);
    b.id = board.id;
    b.thumbnail = board.thumbnail;
    b.elements = board.elements.map((e) => {
      if (e instanceof Rectangle) {
        return Rectangle.from(e);
      }

      return Element.from(e);
    });

    return b;
  }

  static fromJSON(
    json: Pick<Board, 'id' | 'thumbnail' | 'title' | 'description' | 'elements'>
  ) {
    const b = new Board(json.title, json.description);
    b.id = json.id;
    b.thumbnail = json.thumbnail;
    b.elements = json.elements.map((e) => {
      if (e instanceof Rectangle) {
        return Rectangle.fromJSON(e);
      }

      return Element.fromJSON(e);
    });

    return b;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this._id,
      thumbnail: this._thumbnail,
      title: this._title,
      description: this._description,
      elements: this._elements.map((e) => e.toJSON()),
    };
  }
}
