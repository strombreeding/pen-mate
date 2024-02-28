export interface GameProps {
  id: string;
  title: string;
  description: string;
  minReward: number;
  cost: number;
  matchType: string[];
  player: string[];
}

interface GamesObject {
  data: GameProps[];
  find: (id: string) => GameProps | undefined;
  findAll: () => GameProps[];
}
export const Games: GamesObject = {
  find: function (id: string) {
    return this.data.find((game: GameProps) => game.id === id);
  },
  findAll: function () {
    return this.data;
  },
  data: [
    {
      id: '2024junkyard0228',
      title: '우주 고철장',
      description: '짝지게임',
      minReward: 100,
      cost: 50,
      matchType: ['regular'],
      player: ['1p', 'AI'],
    },
    {
      id: '2024Workshop0228',
      title: '중력 작업장',
      description: '테트리스',
      minReward: 100,
      cost: 50,
      matchType: ['regular'],
      player: ['1p', 'Match'],
    },
    {
      id: '2024bang0228',
      title: '코스믹 honor',
      description: '뱅',
      minReward: 800,
      cost: 500,
      matchType: ['regular'],
      player: ['2p', 'Match', 'AI'],
    },
  ],
};
