import { ContainerModule, interfaces } from 'inversify';
import {
  IContractAppealDTO,
  IContractAppealPresenter,
  IContractAppealRepository,
  IContractCategoryDTO,
  IContractCategoryPresenter,
  IContractCategoryRepository,
  IContractCategoryService,
  IContractContentTemplateDTO,
  IContractContentTemplatePresenter,
  IContractContentTemplateRepository,
  IContractContentTemplateService,
  IContractDTO,
  IContractPresenter,
  IContractRepository,
  IContractService,
  IDraftContractPresenter,
  IDraftContractService,
} from '../../../types/contract';
import {
  CONTRACT_CATEGORY_DTO,
  CONTRACT_CONTENT_TEMPLATE_DTO,
  CONTRACT_DTO,
  ContractCategoryDTO,
  ContractContentTemplateDTO,
  ContractDTO,
  DRAFT_CONTRACT_DTO,
  DraftContractDTO,
} from '../dtos';
import {
  CONTRACT_CATEGORY_REPOSITORY,
  CONTRACT_CONTENT_TEMPLATE_REPOSITORY,
  CONTRACT_REPOSITORY,
  ContractCategoryRepository,
  ContractContentTemplateRepository,
  ContractRepository,
  DRAFT_CONTRACT_REPOSITORY,
  DraftContractRepository,
} from '../repositories';
import {
  CONTRACT_CATEGORY_SERVICE,
  CONTRACT_CONTENT_TEMPLATE_SERVICE,
  CONTRACT_SERVICE,
  ContractCategoryService,
  ContractContentTemplateService,
  ContractService,
} from '../services';
import {
  CONTRACT_CATEGORY_PRESENTER,
  CONTRACT_CONTENT_TEMPLATE_PRESENTER,
  CONTRACT_PRESENTER,
  ContractCategoryPresenter,
  ContractContentTemplatePresenter,
  ContractPresenter,
  DRAFT_CONTRACT_PRESENTER,
  DraftContractPresenter,
} from '../presenters';
import { CONTRACT_APPEAL_PRESENTER, ContractAppealPresenter } from '../presenters/ContractAppealPresenter';
import { CONTRACT_APPEAL_REPOSITORY, ContractAppealRepository } from '../repositories/ContractAppealRepository';
import { CONTRACT_APPEAL_DTO, ContractAppealDTO } from '../dtos/ContractAppealDTO';
import { IDraftContractDTO } from 'contract/draftContract/IDraftContractRepository';
import { DRAFT_CONTRACT_SERVICE, DraftContractService } from '../services/DraftContractService';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IContractDTO>(CONTRACT_DTO).to(ContractDTO);
    bind<IContractRepository>(CONTRACT_REPOSITORY).to(ContractRepository);
    bind<IContractService>(CONTRACT_SERVICE).to(ContractService).inSingletonScope();
    bind<IContractPresenter>(CONTRACT_PRESENTER).to(ContractPresenter);
    bind<IContractCategoryRepository>(CONTRACT_CATEGORY_REPOSITORY).to(ContractCategoryRepository);
    bind<IContractCategoryService>(CONTRACT_CATEGORY_SERVICE).to(ContractCategoryService).inSingletonScope();
    bind<IContractCategoryPresenter>(CONTRACT_CATEGORY_PRESENTER).to(ContractCategoryPresenter);
    bind<IContractCategoryDTO>(CONTRACT_CATEGORY_DTO).to(ContractCategoryDTO);
    bind<IContractContentTemplateDTO>(CONTRACT_CONTENT_TEMPLATE_DTO).to(ContractContentTemplateDTO);
    bind<IContractContentTemplatePresenter>(CONTRACT_CONTENT_TEMPLATE_PRESENTER).to(ContractContentTemplatePresenter);
    bind<IContractContentTemplateService>(CONTRACT_CONTENT_TEMPLATE_SERVICE)
      .to(ContractContentTemplateService)
      .inSingletonScope();
    bind<IContractContentTemplateRepository>(CONTRACT_CONTENT_TEMPLATE_REPOSITORY).to(
      ContractContentTemplateRepository,
    );
    bind<IContractAppealPresenter>(CONTRACT_APPEAL_PRESENTER).to(ContractAppealPresenter);
    bind<IContractAppealDTO>(CONTRACT_APPEAL_DTO).to(ContractAppealDTO);
    bind<IContractAppealRepository>(CONTRACT_APPEAL_REPOSITORY).to(ContractAppealRepository);
    bind<IDraftContractDTO>(DRAFT_CONTRACT_DTO).to(DraftContractDTO);
    bind<IDraftContractPresenter>(DRAFT_CONTRACT_PRESENTER).to(DraftContractPresenter);
    bind<IDraftContractService>(DRAFT_CONTRACT_SERVICE).to(DraftContractService).inSingletonScope();
    bind<DraftContractRepository>(DRAFT_CONTRACT_REPOSITORY).to(DraftContractRepository);
  });
};
