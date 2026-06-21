export type StoreDTO = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Store = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateStoreInput = {
  storeId: string;
  name: string;
}