import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BoardApplication,
  Board as BoardElement,
  Rectangle,
  Size,
} from '@front-monorepo/board';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);
  const running = useRef('none');
  const application = useMemo(() => new BoardApplication(), []);
  const board = useMemo(() => new BoardElement('', ''), []);

  useEffect(() => {
    if (!ref.current) return;
    if (running.current !== 'none') return;

    running.current = 'starting';
    application.run(window, ref.current, board)
      .then(() => {
        running.current = 'started';
        const rectangle1 = new Rectangle();
        const rectangle2 = new Rectangle();
        const rectangle3 = new Rectangle();
        rectangle3.size = new Size(1000, 100);
        rectangle1.moveTo(500, 100);
        rectangle2.moveTo(550, 250);
        rectangle3.moveTo(550, 700);
        board.addChild(rectangle1);
        board.addChild(rectangle2);
        board.addChild(rectangle3);
      });
    return () => {
      if (running.current === 'started') {
        running.current = 'none';
        application.stop();
      }
    }
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <canvas ref={ref} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
}
