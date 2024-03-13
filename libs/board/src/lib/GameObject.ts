export enum GameObjectState {
  INACTIVE,
  START,
  STARTED,
  DESTROY,
  DESTROYED,
}

export interface GameObjectEvent {
  onActive(): void;
  onInactive(): void;
  onTriggerEnter(other: any): void;
  onTriggerExit(other: any): void;
  onTriggerStay(other: any): void;
}

export interface GameObjectStateManagement {
  setState(state: GameObjectState): void;
  getState(): GameObjectState;
}

export interface GameObject {
  /**
   * Esta funcion se llama en el siguiente frame despues de que un objeto es agregado
   */
  start(): void;
  /**
   * Esta funcion se llama en cada frame
   * @param delta tiempo transcurrido desde el ultimo frame en milisegundos
   */
  update(delta: number): void;
  /**
   * Esta funcion se llama en cada frame despues de update
   * Se encarga de dibujar el objeto
   */
  draw(): void;
  /**
   * Esta funcion se llama en el siguiente frame despues de que un objeto es marcado para destruirse
   * No es ideal destruir el objeto uno mismo, ya que puede haber dependencias en otros objetos
   */
  destroy(): void;
}
