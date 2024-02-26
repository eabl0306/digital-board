import { Board } from './Board';
import { Rectangle } from './Rectangle';
import { Element } from './Element';

describe('Board class', () => {
  let board: Board;

  beforeEach(() => {
    board = new Board('Title', 'Description');
  });

  test('constructor initializes properties correctly', () => {
    expect(board.title).toBe('Title');
    expect(board.description).toBe('Description');
    expect(board.id).toBeTruthy();
    expect(board.thumbnail).toBeNull();
    expect(board.children).toEqual([]);
  });

  test('setters and getters work correctly', () => {
    board.title = 'New Title';
    board.description = 'New Description';
    board.id = '123';
    board.thumbnail = 'thumbnail.jpg';
    board.children = [new Rectangle()];

    expect(board.title).toBe('New Title');
    expect(board.description).toBe('New Description');
    expect(board.id).toBe('123');
    expect(board.thumbnail).toBe('thumbnail.jpg');
    expect(board.children.length).toBe(1);
    expect(board.children[0]).toBeInstanceOf(Rectangle);
  });

  test('from method creates a new instance from existing board', () => {
    const existingBoard = new Board('Existing Title', 'Existing Description');
    existingBoard.id = 'existing-id';
    existingBoard.thumbnail = 'existing-thumbnail.jpg';
    existingBoard.children = [new Element(), new Rectangle()];

    const newBoard = Board.from(existingBoard);

    expect(newBoard.title).toBe('Existing Title');
    expect(newBoard.description).toBe('Existing Description');
    expect(newBoard.id).toBe('existing-id');
    expect(newBoard.thumbnail).toBe('existing-thumbnail.jpg');
    expect(newBoard.children.length).toBe(2);
    expect(newBoard.children[0]).toBeInstanceOf(Element);
    expect(newBoard.children[1]).toBeInstanceOf(Rectangle);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const empty = new Element();
    const rectangle = new Rectangle();
    const jsonData = {
      id: 'json-id',
      thumbnail: 'json-thumbnail.jpg',
      title: 'JSON Title',
      description: 'JSON Description',
      elements: [empty.toJSON(), rectangle.toJSON()],
    };

    const newBoard = Board.fromJSON(jsonData);

    expect(newBoard.title).toBe('JSON Title');
    expect(newBoard.description).toBe('JSON Description');
    expect(newBoard.id).toBe('json-id');
    expect(newBoard.thumbnail).toBe('json-thumbnail.jpg');
    expect(newBoard.children.length).toBe(2);
    expect(newBoard.children[0]).toBeInstanceOf(Element);
    expect(newBoard.children[1]).toBeInstanceOf(Rectangle);
  });

  test('toJSON method converts board to JSON', () => {
    board.id = 'json-id';
    board.thumbnail = 'json-thumbnail.jpg';
    board.children = [new Element(), new Rectangle()];

    const jsonData = board.toJSON();

    expect(jsonData.title).toBe('Title');
    expect(jsonData.description).toBe('Description');
    expect(jsonData.id).toBe('json-id');
    expect(jsonData.thumbnail).toBe('json-thumbnail.jpg');
    expect(jsonData.elements.length).toBe(2);
    expect(jsonData.elements[0].type).toBe('EMPTY');
    expect(jsonData.elements[1].type).toBe('RECTANGLE');
  });
});
