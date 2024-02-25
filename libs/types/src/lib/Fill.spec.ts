import { Fill } from './Fill';

describe('Fill class', () => {
  let fill: Fill;

  beforeEach(() => {
    fill = new Fill();
  });

  test('constructor initializes properties correctly', () => {
    expect(fill.color).toBe('#ffffff');
    expect(fill.opacity).toBe(1);
  });

  test('setters and getters work correctly', () => {
    fill.color = '#ff0000';
    fill.opacity = 0.5;

    expect(fill.color).toBe('#ff0000');
    expect(fill.opacity).toBe(0.5);

    // Test opacity bounds
    fill.opacity = 2;
    expect(fill.opacity).toBe(1);

    fill.opacity = -1;
    expect(fill.opacity).toBe(0);
  });

  test('setters throw errors for invalid values', () => {
    expect(() => {
      fill.color = 'invalid-color';
    }).toThrow('Invalid color');
  });

  test('from method creates a new instance from existing fill', () => {
    const existingFill = new Fill();
    existingFill.color = '#00ff00';
    existingFill.opacity = 0.7;

    const newFill = Fill.from(existingFill);

    expect(newFill.color).toBe('#00ff00');
    expect(newFill.opacity).toBe(0.7);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      color: '#0000ff',
      opacity: 0.3,
    };

    const newFill = Fill.fromJSON(jsonData);

    expect(newFill.color).toBe('#0000ff');
    expect(newFill.opacity).toBe(0.3);
  });

  test('toJSON method converts fill to JSON', () => {
    fill.color = '#ff00ff';
    fill.opacity = 0.8;

    const jsonData = fill.toJSON();

    expect(jsonData.color).toBe('#ff00ff');
    expect(jsonData.opacity).toBe(0.8);
  });
});
