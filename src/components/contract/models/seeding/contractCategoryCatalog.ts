export const ContractCategoriesList = [
  {
    title: 'Order Contract',
    categoryId: 'CC1OC',
    isDefault: true,
    isArchived: true,
  },
];

export type ContractCategory = {
  title: string;
  categoryId: string;
  isDefault: boolean;
  isArchived: boolean;
};
