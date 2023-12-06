export type Upsert<
  T extends { id: number } & Record<string, any>,
  O extends keyof T = 'id'
> = Partial<Omit<T, O>> & Partial<Omit<T, O>>;

