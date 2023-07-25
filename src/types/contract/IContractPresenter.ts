import { IContract, IContractAppeal, IContractCategory, IContractContentTemplate } from './IContract';

export interface IContractPresenter {
  serialize(contractDocument: IContract, selectors: Array<keyof IContract>): Partial<IContract>;
}

export interface IContractCategoryPresenter {
  serialize(contractCategoryDocument: IContractCategory, selectors: string[]): Partial<IContractCategory>;
}

export interface IContractContentTemplatePresenter {
  serialize(
    contractContentTemplateDocument: IContractContentTemplate,
    selectors: string[],
  ): Partial<IContractContentTemplate>;
}

export interface IContractAppealPresenter {
  serialize(document: IContractAppeal, selectors?: string[]): Partial<IContractAppeal>;
}
