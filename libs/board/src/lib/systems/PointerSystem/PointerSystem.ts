/* eslint-disable @typescript-eslint/no-explicit-any */
import { Board } from '../../Board';
import { System } from '../System';
import { Pointer } from './Pointer';

export class PointerSystem implements System {
  protected ws: WebSocket | undefined;
  protected connected = false;
  protected cycle = 1;
  protected remotePointers: Pointer[] = [];
  protected localPointer: Pointer;

  protected lastLocalPosition: { x: number; y: number } = { x: 0, y: 0 };

  constructor(private app: any, private board: Board) {
    this.localPointer = new Pointer();
    this.localPointer.isLocal = true;
    
    board.addChild(this.localPointer);
  }

  /**
   * SYSTEM
   */

  init(): void {
    /*
    const wsUri = `wss://digital-board-api.bahoque.com/ws`

    this.ws = new WebSocket(wsUri)

    this.ws.onopen = () => {
      this.connected = true;
      this.ws!.send(`/join ${'test1' || this.board.id}`);
    }

    this.ws.onmessage = (ev) => {
      if (typeof ev.data !== 'string') return;
      if (!ev.data.startsWith('cmd pointer')) return;

      const args = ev.data.split(' ');
      const action = args[2];

      if (action === 'update') {
        const id = args[3];
        const x = parseInt(args[4]);
        const y = parseInt(args[5]);

        let pointer = this.remotePointers.find((p) => p.id === id);
        if (!pointer) {
          pointer = new Pointer();
          pointer.id = id;
          pointer.isLocal = false;
          pointer.text = 'Remote';
          this.remotePointers.push(pointer);
          this.board.addChild(pointer);
        } else {
          pointer.position.set(x, y);
        }
      }
    }

    this.ws.onclose = () => {
      this.ws = undefined
    }
    */
  }

  update(delta: number) {
    if (this.ws && this.connected && this.cycle % 2 === 0) {
      if (this.lastLocalPosition.x !== this.localPointer.position.x || this.lastLocalPosition.y !== this.localPointer.position.y) {
        this.lastLocalPosition.x = this.localPointer.position.x;
        this.lastLocalPosition.y = this.localPointer.position.y;
        
        this.ws.send(`cmd pointer update ${this.localPointer.id} ${this.localPointer.position.x} ${this.localPointer.position.y}`);
      }
    }

    this.cycle++;
    if (this.cycle > 60) this.cycle = 1;
  }

  destroy(): void {
    if (this.ws) this.ws.close()
  }
}
