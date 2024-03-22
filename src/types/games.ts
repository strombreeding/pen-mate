export interface GameProps {
  game_url: string;
  title: string;
  description: string;
  matchType: string[];
  player: string[];
  img: string;
  rewards: string[];
  costObj: {
    cost: number;
    type: string;
  }[];
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
  find: (game_url: string) => GameProps | undefined;
  findAll: () => GameProps[];
}
export const Games: GamesObject = {
  find: function (game_url: string) {
    return this.data.find((game: GameProps) => game.game_url === game_url);
  },
  findAll: function () {
    return this.data;
  },
  data: [
    {
      game_url: 'junkyard',
      title: '고철장',
      description:
        '제한 시간내에 최대한 많은 짝을 맞추어 점수를 획득하세요!\n\n운이 좋으면 에너지와 반물질을 획득 할 수 있습니다.',
      matchType: ['정규전'],
      player: ['1p', 'AI'],
      img: 'https://cdn.jsdelivr.net/gh/strombreeding/atata_assets@main/gameImg/junkyard.png',
      rewards: ['energy', 'atata_un', 'antimatter'],
      costObj: [
        {
          type: 'energy',
          cost: 1,
        },
      ],
    },
    {
      game_url: 'Workshop',
      title: '작업장',
      description:
        '중력! 블록을 잘 쌓으세요\n일정 확률로 아이템을 획득할 수 있습니다.\n일정 확률로 포인트를 획득할 수 있습니다.',
      matchType: ['정규전'],
      player: ['1p'],
      img: 'https://cdn.jsdelivr.net/gh/strombreeding/atata_assets@main/gameImg/tetris_img.png',
      rewards: [],
      costObj: [
        {
          type: '',
          cost: 0,
        },
      ],
    },
    {
      game_url: 'bang',
      title: '결투!',
      description:
        '빠르게 반응하고 상대를 예측하세요\n\n이긴다면 큰 보상이, 지면 패배의 쓴 맛을 느낍니다.\n\n아타타 포인트를 획득하여 랭킹을 올려보세요.',
      matchType: ['정규전', '현상금'],
      player: ['2p', '대전', 'AI'],
      img: 'https://cdn.jsdelivr.net/gh/strombreeding/atata_assets@main/gameImg/bang_img.png',
      rewards: ['atata_point', 'atata_un'],
      costObj: [
        {
          type: 'energy',
          cost: 1,
        },
        {
          type: 'atata_un',
          cost: 300,
        },
      ],
    },
  ],
};

export type GameCost = {
  type: string;
  cost: number;
};
