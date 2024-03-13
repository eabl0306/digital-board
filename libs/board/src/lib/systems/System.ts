export interface System {
  init(): void;
  update(delta: number): void;
  destroy(): void;
}
