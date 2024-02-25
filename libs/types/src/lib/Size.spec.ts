import { Size } from './Size';

describe('Size class', () => {
  let size: Size;

  beforeEach(() => {
    size = new Size(100, 200);
  });

  test('constructor initializes properties correctly', () => {
    expect(size.width).toBe(100);
    expect(size.height).toBe(200);
  });

  test('setters and getters work correctly', () => {
    size.width = 150;
    size.height = 250;

    expect(size.width).toBe(150);
    expect(size.height).toBe(250);

    // Test minimum bounds
    size.width = -10;
    size.height = -20;

    expect(size.width).toBe(0);
    expect(size.height).toBe(0);
  });

  test('from method creates a new instance from existing size', () => {
    const existingSize = new Size(300, 400);

    const newSize = Size.from(existingSize);

    expect(newSize.width).toBe(300);
    expect(newSize.height).toBe(400);
  });

  test('fromArray method creates a new instance from array', () => {
    const array: [number, number] = [500, 600];

    const newSize = Size.fromArray(array);

    expect(newSize.width).toBe(500);
    expect(newSize.height).toBe(600);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      width: 700,
      height: 800,
    };

    const newSize = Size.fromJSON(jsonData);

    expect(newSize.width).toBe(700);
    expect(newSize.height).toBe(800);
  });

  test('toJSON method converts size to JSON', () => {
    const jsonData = size.toJSON();

    expect(jsonData.width).toBe(100);
    expect(jsonData.height).toBe(200);
  });
});
