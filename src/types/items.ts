export interface ItemProps {
  id: string;
  name: string;
  cost: number;
  price: number;
  skil: string;
  collectionPath: 'event' | 'drop' | 'store';
  deadline: string | null;
  type: 'attack' | 'util';
}

interface ItemsObject {
  data: ItemProps[];
  find: (id: string) => ItemProps | undefined;
}
export const Items: ItemsObject = {
  find: function (id: string) {
    return this.data.find((Item: ItemProps) => Item.id === id);
  },
  data: [
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
    {
      id: '',
      name: '',
      cost: 0,
      price: 0,
      skil: '',
      collectionPath: null,
      deadline: null,
      type: 'attack',
    },
  ],
};
