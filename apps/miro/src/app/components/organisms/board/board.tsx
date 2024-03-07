import { useEffect, useRef } from 'react';
import {
  BoardApplication,
  Board as BoardElement,
  Rectangle,
} from '@front-monorepo/board';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const board = new BoardElement('', '');
    const application = new BoardApplication();

    const rectangle1 = new Rectangle();
    const rectangle2 = new Rectangle();
    const rectangle3 = new Rectangle();
    rectangle1.position.set(100, 100);
    rectangle2.position.set(150, 0);
    rectangle3.position.set(150, 0);
    rectangle3.rotation = 45 * (Math.PI / 180);
    board.addChild(rectangle1);
    rectangle1.addChild(rectangle2);
    rectangle2.addChild(rectangle3);

    const run = application.run(window, ref.current, board);

    return () => {
      run.then(() => application.stop());
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <button className="absolute p-2 rounded bg-white z-40">Rect</button>
      <canvas ref={ref} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
}
