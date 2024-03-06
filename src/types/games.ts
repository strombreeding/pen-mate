export interface GameProps {
  id: string;
  title: string;
  description: string;
  minReward: number;
  cost: number;
  matchType: string[];
  player: string[];
  img: string;
}
export type GameTitle =
  | 'Cosmic Junkyard'
  | 'Gravity WorkShop'
  | 'Bang!'
  | '우주 고철장'
  | '중력 작업장'
  | '결투!';

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
      id: 'junkyard',
      title: '고철장',
      description:
        '같은 고철끼리 짝을 맞추어야합니다.\n일정 확률로 아이템을 획득할 수 있습니다.',
      minReward: 100,
      cost: 50,
      matchType: ['정규전'],
      player: ['1p', 'AI'],
      img: '',
    },
    {
      id: 'Workshop',
      title: '작업장',
      description:
        '중력! 블록을 잘 쌓으세요\n일정 확률로 아이템을 획득할 수 있습니다.\n일정 확률로 포인트를 획득할 수 있습니다.',
      minReward: 100,
      cost: 50,
      matchType: ['정규전'],
      player: ['1p'],
      img: '',
    },
    {
      id: 'bang',
      title: '결투!',
      description: '뱅',
      minReward: 800,
      cost: 500,
      matchType: ['정규전', '현상금'],
      player: ['2p', '대전', 'AI'],
      img: '',
    },
  ],
};
