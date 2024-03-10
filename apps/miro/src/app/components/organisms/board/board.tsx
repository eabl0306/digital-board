import { useCallback, useMemo, useRef, useState } from 'react';
import {
  BoardApplication,
  Board as BoardElement,
  Rectangle,
  Size,
} from '@front-monorepo/board';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const application = useMemo(() => new BoardApplication(), []);
  const board = useMemo(() => new BoardElement('', ''), []);

  const addRectangle = useCallback(() => {
    const rectangle1 = new Rectangle();
    const rectangle2 = new Rectangle();
    const rectangle3 = new Rectangle();
    rectangle3.size = new Size(1000, 100);
    rectangle1.moveTo(500, 100);
    rectangle2.moveTo(550, 250);
    rectangle3.moveTo(550, 700);
    rectangle3.setStatic(true);
    board.addChild(rectangle1);
    board.addChild(rectangle2);
    board.addChild(rectangle3);
  }, [board]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <div className="absolute z-40">
        {!isRunning && (
          <button
            className="p-2 rounded bg-white"
            onClick={() => {
              if (!ref.current) return;
              application.run(window, ref.current, board);
              setIsRunning(true);
            }}
          >
            Run
          </button>
        )}
        {isRunning && (
          <button className="p-2 rounded bg-white" onClick={addRectangle}>
            Test
          </button>
        )}
      </div>
      <canvas ref={ref} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
}
