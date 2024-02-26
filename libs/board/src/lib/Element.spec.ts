import { Element, ElementType } from './Element';
import { GameObjectState } from './GameObject';
import { Transform } from './Transform';

describe('Element class', () => {
  let element: Element;

  beforeEach(() => {
    element = new Element();
    element.children.push(new Element());
  });

  test('constructor initializes properties correctly', () => {
    expect(element.type).toBe(ElementType.EMPTY);
    expect(element.id).toBeTruthy();
    expect(element.transform).toBeInstanceOf(Transform);
  });

  test('set destroy state for element and children', () => {
    const child = new Element();
    const parent = new Element();
    parent.children.push(child);

    parent.setGameObjectState(GameObjectState.DESTROY);

    expect(parent.getGameObjectState()).toBe(GameObjectState.DESTROY);
    expect(child.getGameObjectState()).toBe(GameObjectState.DESTROY);
  });

  test('destry and destroy children', () => {
    const child = new Element();
    const parent = new Element();
    parent.children.push(child);

    jest.spyOn(child, 'destroy');

    parent.destroy();

    expect(child.destroy).toHaveBeenCalled();
    expect(parent.children.length).toBe(0);
  });

  test('from method creates a new instance from existing element', () => {
    const existingElement = new Element();
    existingElement.children.push(new Element());

    const newElement = Element.from(existingElement);

    expect(newElement.type).toBe(ElementType.EMPTY);
    expect(newElement.id).toEqual(existingElement.id);
    expect(newElement.transform).toEqual(existingElement.transform);
  });

  test('fromJSON method creates a new instance from JSON data', () => {
    const jsonData = {
      id: 'json-id',
      transform: new Transform().toJSON(),
      children: [new Element().toJSON()],
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
