import { useEffect, useMemo, useRef } from 'react';
import {
  BoardApplication,
  Board as BoardElement,
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
    // window, ref.current, board
    application.run({
      root: window,
      view: ref.current,
      board,
      systems: {}
    }).then(() => { running.current = 'started'; });
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
