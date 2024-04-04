import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  BoardApplication,
  Board as BoardElement,
  PhysicBody,
  Rectangle,
  Size,
  SyncronizeElement,
} from '@front-monorepo/board';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);
  const running = useRef('none');
  const application = useMemo(() => new BoardApplication(), []);
  const board = useMemo(() => new BoardElement('', ''), []);

  const makeRectangle = useCallback((x: number, y: number, width: number, height: number) => {
    const rectangle = new Rectangle();
    rectangle.id = 'r' + x
    rectangle.size = new Size(width, height);
    rectangle.addScript(new PhysicBody(rectangle));
    rectangle.addScript(new SyncronizeElement(rectangle));
    rectangle.getScript(PhysicBody)!.setPosition(x, y);
    return rectangle;
  }, [])

  useEffect(() => {
    if (!ref.current) return;
    if (running.current !== 'none') return;

    running.current = 'starting';
    application.run(window, ref.current, board)
      .then(() => {
        running.current = 'started';
        const rectangle1 = makeRectangle(150, 100, 100, 100);
        const rectangle2 = makeRectangle(300, 100, 100, 100);
        board.addChild(rectangle1);
        rectangle1.addChild(rectangle2);
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
