export enum GameObjectState {
  INACTIVE,
  START,
  STARTED,
  DESTROY,
  DESTROYED,
}

export interface GameObjectManager {
  setGameObjectState(state: GameObjectState): void;
  getGameObjectState(): GameObjectState;
}

export interface GameObject {
  start(): void;
  update(delta: number): void;
  draw(): void;
  destroy(): void;
}
