import { IScript } from '../scripts';
import { System } from './System';

type Listeners = {
  onOpen: ((ws: WebSocket) => void)[]
  onMessage: ((ev: MessageEvent) => void)[];
  onClose: (() => void)[];
};

export class SyncronizationSystem implements System {
  protected ws: WebSocket;
  protected connected = false;
  protected listeners: Listeners = {
    onOpen: [],
    onMessage: [],
    onClose: [],
  };

  constructor(uri: string) {
    this.ws = new WebSocket(uri);
    
    this.ws.onopen = () => this.onOpen();
    this.ws.onmessage = (ev) => this.onMessage(ev);
    this.ws.onclose = () => this.onClose();
  }

  isConnected() {
    return this.connected;
  }

  addScript(script: IScript) {
    this.listeners.onOpen.push(script.onWsConnect.bind(script));
    this.listeners.onMessage.push(script.onWsMessage.bind(script));
    this.listeners.onClose.push(script.onWsClose.bind(script));
  }

  addListener(type: 'onOpen' | 'onMessage' | 'onClose', handler: (...args: any[]) => void) {
    this.listeners[type].push(handler);
  }

  send(data: string) {
    this.ws.send(data);
  }

  onOpen() {
    this.connected = true;

    for (const handler of this.listeners.onOpen) {
      handler(this.ws);
    }
  }

  onMessage(ev: MessageEvent) {
    for (const handler of this.listeners.onMessage) {
      handler(ev);
    }
  }

  onClose() {
    this.connected = false;

    for (const handler of this.listeners.onClose) {
      handler();
    }
  }


  init(): void {
    // TODO: Implement
  }

  update(delta: number): void {
    //  TODO: Implement
  }
  
  destroy(): void {
    if (this.ws) this.ws.close()
  }
}
