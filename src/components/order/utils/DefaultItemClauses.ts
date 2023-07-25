import { lowerCase } from '../../../library/helpers';

interface IClause {
  name: string;
  score: 0 | 1;
  isSystemDefined: boolean;
}

interface IGenerateItemClause {
  quantity: number | string;
  condition: string;
}

export const generateDefaultItemClauses = ({ quantity, condition }: IGenerateItemClause): IClause[] => {
  return [
    {
      name: `Item should be of quantity ${quantity}`,
      score: 0,
      isSystemDefined: true,
    },
    {
      name: `Item should be ${lowerCase(condition.replace('_', ' '))}`,
      score: 0,
      isSystemDefined: true,
    },
  ];
};
