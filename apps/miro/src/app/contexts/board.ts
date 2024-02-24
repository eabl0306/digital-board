import { create } from 'zustand';
import { Board, Vector } from '@front-monorepo/types';

export interface BoardState {
  mouse: { position: Vector };
  board: null | Board;
}

export interface BoardActions {
  setMousePosition: (position: Vector) => void;
  setBoard: (board: Board) => void;
}

export const useStore = create<BoardState & BoardActions>((set) => ({
  mouse: { position: new Vector(0, 0) },
  board: null,
  setMousePosition: (position: Vector) => set({ mouse: { position } }),
  setBoard: (board: Board) => set({ board: board }),
}));
