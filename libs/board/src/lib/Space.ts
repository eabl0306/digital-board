import { Board } from './Board';

export interface ISpace {
  id: string;
  title: string;
  boards: Pick<Board, 'title' | 'thumbnail'>[];
  createdAt: string;
  updatedAt: string;
}
