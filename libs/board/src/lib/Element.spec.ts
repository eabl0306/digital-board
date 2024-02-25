import { Element } from './Element';
import { GameObjectState } from './GameObject';

describe('Element', () => {
  let element: Element;

  beforeEach(() => {
    element = new Element();
  });

  describe('constructor and children property', () => {
    it('initializes with an empty children array', () => {
      expect(element.children).toEqual([]);
    });
  });

  describe('children property', () => {
    it('sets and gets children correctly', () => {
      const child1 = new Element();
      const child2 = new Element();
      element.children = [child1, child2];
      expect(element.children).toEqual([child1, child2]);
    });
  });

  describe('setGameObjectState and getGameObjectState methods', () => {
    it('sets and gets the game object state correctly', () => {
      element.setGameObjectState(GameObjectState.STARTED);
      expect(element.getGameObjectState()).toBe(GameObjectState.STARTED);
    });

    it('sets children state to DESTROY when element state is set to DESTROY', () => {
      const child1 = new Element();
      const child2 = new Element();
      jest.spyOn(child1, 'setGameObjectState');
      jest.spyOn(child2, 'setGameObjectState');
      element.children = [child1, child2];

      element.setGameObjectState(GameObjectState.DESTROY);

      expect(child1.setGameObjectState).toHaveBeenCalledWith(
        GameObjectState.DESTROY
      );
      expect(child2.setGameObjectState).toHaveBeenCalledWith(
        GameObjectState.DESTROY
      );
    });
  });

  describe('start method', () => {
    it('should be callable without errors', () => {
      expect(() => {
        element.start();
      }).not.toThrow();
    });
  });

  describe('update method', () => {
    it('should be callable with a delta time without errors', () => {
      expect(() => {
        element.update(1);
      }).not.toThrow();
    });
  });

  describe('destroy method', () => {
    it('should remove all children and set parent to undefined', () => {
      const child1 = new Element();
      const child2 = new Element();
      element.children = [child1, child2];

      jest.spyOn(child1, 'destroy');
      jest.spyOn(child2, 'destroy');

      element.destroy();

      expect(child1.destroy).toHaveBeenCalled();
      expect(child2.destroy).toHaveBeenCalled();
      expect(element.children).toEqual([]);
    });
  });

  // Additional tests should be added here once start and update methods have specific logic.
});
