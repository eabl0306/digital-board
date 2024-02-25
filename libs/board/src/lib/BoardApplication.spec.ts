import { BoardApplication } from './BoardApplication';
import { Board } from './Board';
import { Element } from './Element';
import { GameObjectState } from './GameObject';

const tickerStopMock = jest.fn();

jest.mock('pixi.js', () => ({
  Application: jest.fn().mockImplementation(() => ({
    ticker: {
      add: (cb: (delta: number) => void) => {
        cb(0);
        return { stop: tickerStopMock };
      },
      maxFPS: 0,
    },
  })),
}));

describe('BoardApplication', () => {
  let board: Board;
  let boardApplication: BoardApplication;

  beforeEach(() => {
    board = new Board('', '');
    boardApplication = new BoardApplication(
      {} as Window,
      {} as HTMLCanvasElement,
      board
    );
  });

  describe('maxFPS property', () => {
    it('sets and gets maxFPS correctly', () => {
      boardApplication.maxFPS = 30;
      expect(boardApplication.maxFPS).toBe(30);
    });

    it('ensures min value for maxFPS is 0', () => {
      boardApplication.maxFPS = -1;
      expect(boardApplication.maxFPS).toBe(0);
    });
  });

  describe('runElements method', () => {
    it('run element update method if state is start', () => {
      board.children = [new Element()];

      jest.spyOn(board.children[0], 'start');
      jest.spyOn(board.children[0], 'setGameObjectState');

      boardApplication.run();

      expect(board.children[0].start).toHaveBeenCalled();
      expect(board.children[0].setGameObjectState).toHaveBeenCalledWith(
        GameObjectState.STARTED
      );
    });

    it('run element update method if state is started', () => {
      board.children = [new Element()];
      board.children[0].setGameObjectState(GameObjectState.STARTED);

      jest.spyOn(board.children[0], 'update');

      boardApplication.run();

      expect(board.children[0].update).toHaveBeenCalled();
    });

    it('run element destroy method if state is destroy', () => {
      board.children = [new Element()];
      board.children[0].setGameObjectState(GameObjectState.DESTROY);

      jest.spyOn(board.children[0], 'destroy');
      jest.spyOn(board.children[0], 'setGameObjectState');

      boardApplication.run();

      expect(board.children[0].destroy).toHaveBeenCalled();
      expect(board.children[0].setGameObjectState).toHaveBeenCalledWith(
        GameObjectState.DESTROYED
      );
    });

    it('remove element from board if state is destroyed', () => {
      const child = new Element();

      board.children = [child];
      board.children[0].setGameObjectState(GameObjectState.DESTROYED);

      jest.spyOn(board, 'removeChild');

      boardApplication.run();

      expect(board.removeChild).toHaveBeenCalledWith(child);
    });

    it('remove element from board if state is destroyed and parent is defined', () => {
      const parent = new Element();
      const child = new Element();

      parent.children = [child];
      parent.children[0].setGameObjectState(GameObjectState.DESTROYED);

      board.children = [parent];

      jest.spyOn(parent, 'removeChild');

      boardApplication.run();

      expect(parent.removeChild).toHaveBeenCalledWith(child);
    });

    it('does not run element methods if state is inactive', () => {
      const child = new Element();
      child.setGameObjectState(GameObjectState.INACTIVE);

      jest.spyOn(child, 'start');
      jest.spyOn(child, 'update');
      jest.spyOn(child, 'destroy');

      board.children = [child];

      boardApplication.run();

      expect(child.start).not.toHaveBeenCalled();
      expect(child.update).not.toHaveBeenCalled();
      expect(child.destroy).not.toHaveBeenCalled();
    });
  });

  describe('run method', () => {
    it('starts the board and initializes the main loop', () => {
      jest.spyOn(board, 'start');
      jest.spyOn(board, 'update');

      boardApplication.run();

      expect(board.start).toHaveBeenCalled();
      expect(board.update).toHaveBeenCalled();
    });
  });

  describe('stop method', () => {
    it('throws error if main loop is not running', () => {
      expect(() => {
        boardApplication.stop();
      }).toThrow('Main loop is not running');
    });

    it('stops the main loop if it is running', () => {
      // Simulate a running main loop
      boardApplication.run();
      boardApplication.stop();

      expect(tickerStopMock).toHaveBeenCalled();
    });
  });
});
