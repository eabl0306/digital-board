import { useEffect, useRef } from 'react';
import { Application } from 'pixi.js';

export function Board() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const app = new Application({ view: ref.current, resizeTo: window });
    const mainLoop = app.ticker.add((delta) => {});

    return () => {
      mainLoop.destroy();
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen">
      <button className="absolute p-2 rounded bg-white z-40">Rect</button>
      <canvas ref={ref} className="absolute top-0 left-0 w-full h-full z-0" />
    </div>
  );
}
