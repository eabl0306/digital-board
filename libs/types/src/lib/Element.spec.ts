import { Element, ElementType } from './Element';
import { Transform } from './Transform';

describe('Element class', () => {
  let element: Element;

  beforeEach(() => {
    element = new Element();
  });

  test('constructor initializes properties correctly', () => {
    expect(element.type).toBe(ElementType.EMPTY);
    expect(element.id).toBeTruthy();
    expect(element.transform).toBeInstanceOf(Transform);
  });

  test('from method creates a new instance from existing element', () => {
    const existingElement = new Element();

    const newElement = Element.from(existingElement);

    expect(newElement.type).toBe(ElementType.EMPTY);
    expect(newElement.id).toEqual(existingElement.id);
    expect(newElement.transform).toEqual(existingElement.transform);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      id: 'json-id',
      transform: new Transform().toJSON(),
    };

    const newElement = Element.fromJSON(jsonData);

    expect(newElement.type).toBe(ElementType.EMPTY);
    expect(newElement.id).toBe('json-id');
    expect(newElement.transform).toBeInstanceOf(Transform);
  });

  test('toJSON method converts element to JSON', () => {
    const jsonData = element.toJSON();

    expect(jsonData.type).toBe(ElementType.EMPTY);
    expect(jsonData.id).toBe(element.id);
    expect(jsonData.transform).toEqual(element.transform.toJSON());
  });
});
