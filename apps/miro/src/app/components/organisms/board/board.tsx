import { useEffect, useRef } from 'react';
import {
  BoardApplication,
  BoardGameObject as BoardComponent,
} from '@front-monorepo/board';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const board = new BoardComponent('', '');
    const application = new BoardApplication(window, ref.current, board);

    application.run();

    return () => application.stop();
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <button className="absolute p-2 rounded bg-white z-40">Rect</button>
      <canvas ref={ref} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
}
