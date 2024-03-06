import { Element, ElementType, IElement } from './Element';
import { Rectangle } from './Rectangle';

export interface IBoard extends IElement {
  thumbnail: string | null;
  title: string;
  description: string;
  children: IElement[];
}

export class Board extends Element {
  protected _thumbnail: string | null;
  protected _title: string;
  protected _description: string;

  constructor(title: string, description: string) {
    super();
    this._thumbnail = null;
    this._title = title;
    this._description = description;
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

  static override from(board: Board) {
    const b = new Board(board.title, board.description);
    b.id = board.id;
    b.thumbnail = board.thumbnail;
    b.addChild(
      ...board.children.map((e) => {
        switch (e.type) {
          case ElementType.RECTANGLE:
            return Rectangle.from(e as Rectangle);
          case ElementType.EMPTY:
            return Element.from(e as Element);
        }
      })
    );

    return b;
  }

  static override fromJSON(json: IBoard) {
    const b = new Board(json.title, json.description);
    b.id = json.id;
    b.thumbnail = json.thumbnail;
    b.addChild(
      ...json.children.map((e) => {
        switch (e.type) {
          case ElementType.RECTANGLE:
            return Rectangle.from(e as Rectangle);
          case ElementType.EMPTY:
            return Element.from(e as Element);
        }
      })
    );

    return b;
  }

  override toJSON(): IBoard {
    return {
      ...super.toJSON(),
      thumbnail: this._thumbnail,
      title: this._title,
      description: this._description,
    };
  }
}
