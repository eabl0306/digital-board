import { create } from 'zustand';
import { Board, Vector2D } from '@front-monorepo/board';

export interface BoardState {
  mouse: { position: Vector2D };
  board: null | Board;
}

export interface BoardActions {
  setMousePosition: (position: Vector2D) => void;
  setBoard: (board: Board) => void;
}

export const useStore = create<BoardState & BoardActions>((set) => ({
  mouse: { position: new Vector2D(0, 0) },
  board: null,
  setMousePosition: (position: Vector2D) => set({ mouse: { position } }),
  setBoard: (board: Board) => set({ board: board }),
}));
