export type Commodity = {
  id: number;

  name: string;

  source: string;

  parent_id?: number;

  parent: Commodity;
};
