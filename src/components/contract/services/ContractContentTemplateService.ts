import { inject, injectable } from 'inversify';
import {
  IContractContentTemplate,
  ICreateContractContentTemplate,
  IContractContentTemplateDTO,
  IContractContentTemplatePresenter,
  IContractContentTemplateRepository,
  IContractContentTemplateService,
  IContractService,
} from '../../../types/contract';

import { CONTRACT_CONTENT_TEMPLATE_DTO } from '../dtos';
import { CONTRACT_CONTENT_TEMPLATE_PRESENTER } from '../presenters';
import { CONTRACT_CONTENT_TEMPLATE_REPOSITORY } from '../repositories';
import { CONTRACT_SERVICE } from './ContractService';
import { logger, NotFoundError } from '../../../library/helpers';
import { i18n, translations } from '../../../locales/i18n';

export const CONTRACT_CONTENT_TEMPLATE_SERVICE = Symbol('ContractContentTemplateService');

@injectable()
export class ContractContentTemplateService implements IContractContentTemplateService {
  public constructor(
    @inject(CONTRACT_CONTENT_TEMPLATE_DTO) private readonly contractContentTemplateDTO: IContractContentTemplateDTO,
    @inject(CONTRACT_CONTENT_TEMPLATE_REPOSITORY)
    private readonly contractContentTemplateRepository: IContractContentTemplateRepository,
    @inject(CONTRACT_CONTENT_TEMPLATE_PRESENTER)
    private readonly contractContentTemplatePresenter: IContractContentTemplatePresenter,
    @inject(CONTRACT_SERVICE) private readonly contractService: IContractService,
  ) {}

  public async create(payload: ICreateContractContentTemplate): Promise<Partial<IContractContentTemplate>> {
    const dto = this.contractContentTemplateDTO.create(payload);
    logger.info(`ContractContentTemplateService.createContractContentTemplate payload: ${JSON.stringify(dto)}`);

    const contract = await this.contractService.read({ id: dto.contractId });

    if (!contract) throw new NotFoundError(i18n.t(translations.contract.responses.contractContentTemplateNotFound));

    const createContractContentTemplate = (await this.contractContentTemplateRepository.create(
      dto as IContractContentTemplate,
    )) as IContractContentTemplate;

    logger.info(`contractContentTemplate created: ${JSON.stringify(createContractContentTemplate)}`);

    return this.contractContentTemplatePresenter.serialize(createContractContentTemplate, ['contractId']);
  }

  public async read(query: { contractId: string }): Promise<Partial<IContractContentTemplate> | null> {
    const template = (await this.contractContentTemplateRepository.findOne(query)) as IContractContentTemplate;
    return this.contractContentTemplatePresenter.serialize(template, []);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update(query: { contractId: string }, payload: any): Promise<Partial<IContractContentTemplate> | null> {
    const updatedTemplate = (await this.contractContentTemplateRepository.update(
      query,
      payload,
    )) as IContractContentTemplate;

    return this.contractContentTemplatePresenter.serialize(updatedTemplate, []);
  }
}
