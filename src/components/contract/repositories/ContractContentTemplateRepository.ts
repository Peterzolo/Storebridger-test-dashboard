import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IContractContentTemplate, IContractContentTemplateRepository } from '../../../types/contract';
import { ContractContentTemplate } from '../models';

export const CONTRACT_CONTENT_TEMPLATE_REPOSITORY = Symbol('ContractContentTemplateRepository');

@injectable()
export class ContractContentTemplateRepository
  extends BaseRepository<IContractContentTemplate>
  implements IContractContentTemplateRepository
{
  constructor() {
    super(ContractContentTemplate);
  }
}
