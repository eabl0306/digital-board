import { Stroke } from './Stroke';

describe('Stroke class', () => {
  let stroke: Stroke;

  beforeEach(() => {
    stroke = new Stroke();
  });

  test('constructor initializes properties correctly', () => {
    expect(stroke.color).toBe('#ffffff');
    expect(stroke.opacity).toBe(1);
    expect(stroke.width).toBe(1);
  });

  test('setters and getters work correctly', () => {
    stroke.color = '#ff0000';
    stroke.opacity = 0.5;
    stroke.width = 3;

    expect(stroke.color).toBe('#ff0000');
    expect(stroke.opacity).toBe(0.5);
    expect(stroke.width).toBe(3);

    // Test minimum bounds
    stroke.opacity = -0.5;
    stroke.width = -3;

    expect(stroke.opacity).toBe(0);
    expect(stroke.width).toBe(0);

    // Test invalid color
    expect(() => {
      stroke.color = 'invalid-color';
    }).toThrow('Invalid color');
  });

  test('from method creates a new instance from existing stroke', () => {
    const existingStroke = new Stroke();
    existingStroke.color = '#00ff00';
    existingStroke.opacity = 0.7;
    existingStroke.width = 2;

    const newStroke = Stroke.from(existingStroke);

    expect(newStroke.color).toBe('#00ff00');
    expect(newStroke.opacity).toBe(0.7);
    expect(newStroke.width).toBe(2);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      color: '#0000ff',
      opacity: 0.3,
      width: 4,
    };

    const newStroke = Stroke.fromJSON(jsonData);

    expect(newStroke.color).toBe('#0000ff');
    expect(newStroke.opacity).toBe(0.3);
    expect(newStroke.width).toBe(4);
  });

  test('toJSON method converts stroke to JSON', () => {
    stroke.color = '#ff00ff';
    stroke.opacity = 0.8;
    stroke.width = 5;

    const jsonData = stroke.toJSON();

    expect(jsonData.color).toBe('#ff00ff');
    expect(jsonData.opacity).toBe(0.8);
    expect(jsonData.width).toBe(5);
  });
});
