export interface Player {
  position: number;
  profile: string;
  netBalance: number;
  isOut: boolean;
}

export interface Players {
  [key: string]: Player;
}
