import { Board } from './Board';

export interface Space {
  id: string;
  title: string;
  boards: Pick<Board, 'title' | 'thumbnail'>[];
  createdAt: string;
  updatedAt: string;
}
