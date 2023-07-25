import {
  ICreateDraftContract,
  IDraftContract,
  IDraftContractDTO,
  IDraftContractPresenter,
  IDraftContractRepository,
  IDraftContractService,
} from 'contract';
import { injectable, inject } from 'inversify';
import { USER_SERVICE } from '../../../components/user/services';
import { IUser, IUserService } from 'user';
import { DRAFT_CONTRACT_REPOSITORY } from '../repositories';
import { DRAFT_CONTRACT_DTO } from '../dtos';
import { DRAFT_CONTRACT_PRESENTER } from '../presenters';
import { logger } from '../../../library/helpers';

export const DRAFT_CONTRACT_SERVICE = Symbol('DraftContractService');

@injectable()
export class DraftContractService implements IDraftContractService {
  public constructor(
    @inject(DRAFT_CONTRACT_REPOSITORY) private readonly draftContractRepository: IDraftContractRepository,
    @inject(DRAFT_CONTRACT_DTO) private readonly draftContractDTO: IDraftContractDTO,
    @inject(DRAFT_CONTRACT_PRESENTER) private readonly draftContractPresenter: IDraftContractPresenter,
    @inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  public async create(payload: ICreateDraftContract): Promise<Partial<IDraftContract>> {
    const author = await this._getUser(payload.authorEmail);
    const dto = this.draftContractDTO.create({ ...payload, authorId: author.id });
    logger.info(`Create Draft contract payload: ${JSON.stringify(dto)}`);

    const createDraftContract = await this.draftContractRepository.create(dto as IDraftContract);
    logger.info(`Create Draft contract: ${JSON.stringify(createDraftContract)}`);

    const draftContract = this.draftContractPresenter.serialize(await createDraftContract, [
      'authorId',
      'contract',
      'id',
    ]);

    return draftContract;
  }

  public async readMany(payload: { userEmail: string }): Promise<Partial<IDraftContract>[]> {
    logger.info(`Read Draft contract payload: ${JSON.stringify(payload)}`);
    const { userEmail } = payload;
    const user = await this._getUser(userEmail);
    const draftContractList = await this.draftContractRepository.find({ authorId: user.id });
    logger.info(`Read Draft contract: ${JSON.stringify(draftContractList)}`);

    const draftContract = draftContractList.map((draftContract) =>
      this.draftContractPresenter.serialize(draftContract, ['authorId', 'contract', 'id']),
    );

    return draftContract;
  }

  private async _getUser(email: string): Promise<IUser> {
    const user = await this.userService.read({ email });

    if (!user) throw new Error(`User with email ${email} not found`);

    return user as IUser;
  }
}
