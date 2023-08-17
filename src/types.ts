export type ListType = {
  id: number;
  title: string;
};

export type TaskType = {
  id: number;
  listId: number;
  title: string;
  description: string;
  status: string;
};
