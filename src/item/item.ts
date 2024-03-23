export const cdnDefaultURL =
  'https://cdn.jsdelivr.net/gh/strombreeding/atata_assets@main/';
export const items = [
  {
    item_name: '아타타스톤',
    cost: 0,
    item_img: cdnDefaultURL + 'pngs/atata_stone.png',
    item_description: '아타타에서 사용하는 공용 재화',
    skill: [],
    type: 'util',
    price: 10,
    usage: '잡화',
  },
  {
    item_name: '아타타포인트',
    cost: 0,
    item_img: cdnDefaultURL + 'pngs/atata_point.png',
    item_description:
      '랭킹을 올리기 위해 필요한 포인트\n아타타스톤으로 구매하거나 [결투!] 에서 획득할 수 있다.',
    skill: [],
    type: 'util',
    price: 100,
    usage: '잡화',
  },
  {
    item_name: '에너지',
    cost: 1,
    item_img: cdnDefaultURL + 'pngs/energy.png',
    item_description: '에너지가 부족할때 사용하세요',
    skill: [],
    type: 'util',
    price: 100,
    usage: '소비',
  },
  {
    item_name: '에너지x30',
    cost: 30,
    item_img: cdnDefaultURL + 'pngs/energy.png',
    item_description: '에너지 조각',
    skill: [],
    type: 'util',
    price: 1350,
    usage: '소비',
  },
  {
    item_name: '반물질 조각',
    cost: 0,
    item_img: cdnDefaultURL + 'pngs/antimatter.png',
    item_description: '에너지 조각',
    skill: [],
    type: 'util',
    price: 1350,
    usage: '소비',
  },
  {
    item_name: '우주 쓰레기',
    cost: 0,
    item_img: cdnDefaultURL + 'pngs/antimatter.png',
    item_description: '흔한 고철덩어리',
    skill: [],
    type: 'util',
    price: 30,
    usage: '잡화',
  },
];

// 상점에 들어갔을때 데이터는 이렇게 불러와져야 한다

[
  {
    //아타타 포인트
  },
];

// 유저 인벤토리를 불러올땐 다음과 같을 것이다

[
  {
    // 아이템 스키마 (id로 저장시켜놓기)
    // 갯수
  },
];
