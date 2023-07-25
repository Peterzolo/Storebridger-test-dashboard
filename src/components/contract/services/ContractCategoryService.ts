import { inject, injectable } from 'inversify';
import {
  IContractCategory,
  IContractCategoryDTO,
  IContractCategoryPresenter,
  IContractCategoryRepository,
  IContractCategoryService,
  ICreateContractCategory,
} from 'contract';
import { CONTRACT_CATEGORY_DTO } from '../dtos';
import { CONTRACT_CATEGORY_REPOSITORY } from '../repositories';
import { CONTRACT_CATEGORY_PRESENTER } from '../presenters';
import { ForbiddenError, logger } from '../../../library/helpers';
import { IUser, IUserService } from 'user';
import { i18n, translations } from '../../../locales/i18n';
import { USER_SERVICE } from '../../user/services';

export const CONTRACT_CATEGORY_SERVICE = Symbol('ContractCategoryService');

@injectable()
export class ContractCategoryService implements IContractCategoryService {
  public constructor(
    @inject(CONTRACT_CATEGORY_DTO) private readonly contractCategoryDTO: IContractCategoryDTO,
    @inject(CONTRACT_CATEGORY_REPOSITORY) private readonly contractCategoryRepository: IContractCategoryRepository,
    @inject(CONTRACT_CATEGORY_PRESENTER) private readonly contractCategoryPresenter: IContractCategoryPresenter,
    @inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  public async create(payload: ICreateContractCategory): Promise<Partial<IContractCategory>> {
    const user = await this._getUser(payload.createdBy);

    const dto = this.contractCategoryDTO.create({ ...payload, createdBy: user.id as string });
    logger.info(`ContractCategoryService.createContractCategory payload: ${JSON.stringify(dto)}`);

    const contractCategory = await this.read({ title: dto.title });

    if (contractCategory) throw new ForbiddenError(i18n.t(translations.contract.responses.contractCategoryExists));

    const createContractCategory = (await this.contractCategoryRepository.create(
      dto as IContractCategory,
    )) as IContractCategory;

    logger.info(`contractCategory created: ${JSON.stringify(createContractCategory)}`);

    return this.contractCategoryPresenter.serialize(createContractCategory, ['title']);
  }

  public async readMany(): Promise<Array<Partial<IContractCategory>>> {
    const contractCategories = (await this.contractCategoryRepository.find({})) as Array<IContractCategory>;

    logger.info(`contractCategories found: ${JSON.stringify(contractCategories)}`);

    return contractCategories.map((contractCategory) =>
      this.contractCategoryPresenter.serialize(contractCategory as IContractCategory, ['title', 'id']),
    );
  }

  public async read(query: Record<string, unknown>): Promise<IContractCategory | null> {
    return (await this.contractCategoryRepository.findOne(query)) as IContractCategory | null;
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }
}
