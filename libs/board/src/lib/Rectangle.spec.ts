import { Rectangle } from './Rectangle';
import { Fill } from './Fill';
import { Stroke } from './Stroke';
import { Size } from './Size';
import { Transform } from './Transform';
import { ElementType } from './Element';
import { Vector } from './Vector';

describe('Rectangle class', () => {
  let rectangle: Rectangle;

  beforeEach(() => {
    rectangle = new Rectangle();
  });

  test('constructor initializes properties correctly', () => {
    expect(rectangle.fill).toBeInstanceOf(Fill);
    expect(rectangle.stroke).toBeInstanceOf(Stroke);
    expect(rectangle.size).toBeInstanceOf(Size);
    expect(rectangle.radius).toBe(0);
  });

  test('setters and getters work correctly', () => {
    const newFill = new Fill();
    const newStroke = new Stroke();
    const newSize = new Size(200, 300);

    rectangle.fill = newFill;
    rectangle.stroke = newStroke;
    rectangle.size = newSize;
    rectangle.radius = 10;

    expect(rectangle.fill).toBe(newFill);
    expect(rectangle.stroke).toBe(newStroke);
    expect(rectangle.size).toBe(newSize);
    expect(rectangle.radius).toBe(10);

    // Test minimum bounds
    rectangle.radius = -5;

    expect(rectangle.radius).toBe(0);
  });

  test('from method creates a new instance from existing rectangle', () => {
    const existingRectangle = new Rectangle();
    existingRectangle.fill = new Fill();
    existingRectangle.stroke = new Stroke();
    existingRectangle.size = new Size(400, 500);
    existingRectangle.radius = 20;

    const newRectangle = Rectangle.from(existingRectangle);

    expect(newRectangle.id).toBe(existingRectangle.id);
    expect(newRectangle.transform).toEqual(existingRectangle.transform);
    expect(newRectangle.fill).toEqual(existingRectangle.fill);
    expect(newRectangle.stroke).toEqual(existingRectangle.stroke);
    expect(newRectangle.size).toEqual(existingRectangle.size);
    expect(newRectangle.radius).toBe(existingRectangle.radius);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      id: 'json-id',
      type: ElementType.RECTANGLE,
      transform: { position: { x: 10, y: 20 }, rotation: 30, scale: 1 },
      fill: { color: '#ff0000', opacity: 0.5 },
      stroke: { color: '#0000ff', opacity: 0.3, width: 2 },
      size: { width: 600, height: 700 },
      radius: 25,
      children: [],
    };

    const newRectangle = Rectangle.fromJSON(jsonData);

    expect(newRectangle.id).toBe('json-id');
    expect(newRectangle.transform).toEqual(
      Transform.fromJSON(jsonData.transform)
    );
    expect(newRectangle.fill).toEqual(Fill.fromJSON(jsonData.fill));
    expect(newRectangle.stroke).toEqual(Stroke.fromJSON(jsonData.stroke));
    expect(newRectangle.size).toEqual(Size.fromJSON(jsonData.size));
    expect(newRectangle.radius).toBe(jsonData.radius);
  });

  test('toJSON method converts rectangle to JSON', () => {
    rectangle.transform.position = Vector.fromArray([30, 40]);
    rectangle.transform.rotation = 45;
    rectangle.fill = Fill.fromJSON({ color: '#00ff00', opacity: 0.7 });
    rectangle.stroke = Stroke.fromJSON({
      color: '#ffff00',
      opacity: 0.4,
      width: 3,
    });
    rectangle.size = Size.fromJSON({ width: 800, height: 900 });
    rectangle.radius = 30;

    const jsonData = rectangle.toJSON();

    expect(jsonData.id).toBe(rectangle.id);
    expect(jsonData.type).toBe('RECTANGLE');
    expect(jsonData.transform).toEqual({
      position: { x: 30, y: 40 },
      rotation: 45,
      scale: 1,
    });
    expect(jsonData.fill).toEqual({ color: '#00ff00', opacity: 0.7 });
    expect(jsonData.stroke).toEqual({
      color: '#ffff00',
      opacity: 0.4,
      width: 3,
    });
    expect(jsonData.size).toEqual({ width: 800, height: 900 });
    expect(jsonData.radius).toBe(30);
  });
});
