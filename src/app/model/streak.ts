export interface Streak {
  id?: number;
  title?: string;
  completed?: boolean;
  currentStreak?: number;
  previousStreak?: number;
  longestStreak?: number;
  lastCompleted?: Date;
}

export type AddStreak = Omit<
  Streak,
  | 'id'
  | 'completed'
  | 'currentStreak'
  | 'previousStreak'
  | 'lastCompleted'
  | 'longestStreak'
>;
export type EditStreak = { id: Streak['id']; data: AddStreak };
export type RemoveStreak = Streak['id'];
