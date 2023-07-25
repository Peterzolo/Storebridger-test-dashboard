import { IDraftContract } from './IDraftContract';

export interface IDraftContractPresenter {
  serialize(draftContractDocument: IDraftContract, selectors: Array<keyof IDraftContract>): Partial<IDraftContract>;
}
