import { Transform } from './Transform';
import { Vector } from './Vector';

describe('Transform class', () => {
  let transform: Transform;

  beforeEach(() => {
    transform = new Transform();
  });

  test('constructor initializes properties correctly', () => {
    expect(transform.position).toBeInstanceOf(Vector);
    expect(transform.rotation).toBe(0);
    expect(transform.scale).toBe(1);
  });

  test('setters and getters work correctly', () => {
    const newPosition = Vector.fromArray([10, 20]);
    transform.position = newPosition;
    transform.rotation = 45;
    transform.scale = 2;

    expect(transform.position).toBe(newPosition);
    expect(transform.rotation).toBe(45);
    expect(transform.scale).toBe(2);
  });

  test('from method creates a new instance from existing transform', () => {
    const existingTransform = new Transform();
    existingTransform.position = Vector.fromArray([30, 40]);
    existingTransform.rotation = 90;
    existingTransform.scale = 3;

    const newTransform = Transform.from(existingTransform);

    expect(newTransform.position).toEqual(existingTransform.position);
    expect(newTransform.rotation).toBe(existingTransform.rotation);
    expect(newTransform.scale).toBe(existingTransform.scale);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      position: { x: 50, y: 60 },
      rotation: 135,
      scale: 4,
    };

    const newTransform = Transform.fromJSON(jsonData);

    expect(newTransform.position).toEqual(Vector.fromJSON(jsonData.position));
    expect(newTransform.rotation).toBe(jsonData.rotation);
    expect(newTransform.scale).toBe(jsonData.scale);
  });

  test('toJSON method converts transform to JSON', () => {
    transform.position = Vector.fromArray([70, 80]);
    transform.rotation = 180;
    transform.scale = 5;

    const jsonData = transform.toJSON();

    expect(jsonData.position).toEqual({ x: 70, y: 80 });
    expect(jsonData.rotation).toBe(180);
    expect(jsonData.scale).toBe(5);
  });
});
