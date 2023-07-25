import { inject, injectable } from 'inversify';
import {
  IAcceptContractInvitation,
  IContract,
  IContractAppeal,
  IContractAppealDTO,
  IContractAppealPresenter,
  IContractAppealRepository,
  IContractCategoryService,
  IContractDTO,
  IContractPresenter,
  IContractRepository,
  IContractService,
  IContractSignature,
  ICreateContract,
  ICreateContractAppeal,
  IInviteRecipient,
  IReadContract,
  IUpdateContract,
} from '../../../types/contract';
import { CONTRACT_DTO } from '../dtos';
import { CONTRACT_PRESENTER } from '../presenters';
import { CONTRACT_REPOSITORY } from '../repositories';
import { generateEmailTemplate, generateInviteToken, logger, NotFoundError } from '../../../library/helpers';
import { i18n, translations } from '../../../locales/i18n';
import { CONTRACT_CATEGORY_SERVICE } from './ContractCategoryService';
import { IUser } from '../../../types/user';
import { BadRequestError } from '../../../library/helpers/error';
import { USER_SERVICE } from '../../user/services/UserService';
import { IUserService } from '../../../types/user/IUserService';
import { AUTH_SERVICE } from '../../../components/auth/services';
import { IAuthService } from 'auth';
import _ from 'lodash';
import { EmailTemplate } from '../../../library/constants/emailTemplate';
import { CONTRACT_APPEAL_REPOSITORY } from '../repositories/ContractAppealRepository';
import { CONTRACT_APPEAL_PRESENTER } from '../presenters/ContractAppealPresenter';
import { CONTRACT_APPEAL_DTO } from '../dtos/ContractAppealDTO';
import { EMAIL_SERVICE } from '../../notification/services';
import { IEmailService } from 'notification';
import { ORDER_REPOSITORY } from '../../../components/order/repositories';
import { IOrder, IOrderRepository } from 'order';

export const CONTRACT_SERVICE = Symbol('ContractService');

@injectable()
export class ContractService implements IContractService {
  private contractAccessibleProperties: (keyof IContract)[] = [
    'id',
    'authorId',
    'recipientId',
    'recipientEmail',
    'inviteeEmail',
    'status',
    'contractCategoryId',
    'createdAt',
    'updatedAt',
    'hasRecipientSigned',
    'hasAuthorSigned',
    'authorSignatureDate',
    'recipientSignatureDate',
  ];

  public constructor(
    @inject(CONTRACT_DTO) private readonly contractDTO: IContractDTO,
    @inject(CONTRACT_PRESENTER) private readonly contractPresenter: IContractPresenter,
    @inject(CONTRACT_REPOSITORY) private readonly contractRepository: IContractRepository,
    @inject(CONTRACT_CATEGORY_SERVICE) private readonly contractCategoryService: IContractCategoryService,
    @inject(USER_SERVICE) private readonly userService: IUserService,
    @inject(AUTH_SERVICE) private readonly authService: IAuthService,
    @inject(CONTRACT_APPEAL_REPOSITORY) private readonly contractAppealRepository: IContractAppealRepository,
    @inject(CONTRACT_APPEAL_DTO) private readonly contractAppealDTO: IContractAppealDTO,
    @inject(CONTRACT_APPEAL_PRESENTER) private readonly contractAppealPresenter: IContractAppealPresenter,
    @inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
    @inject(ORDER_REPOSITORY) private readonly orderRepository: IOrderRepository,
  ) {}

  public async create(payload: ICreateContract): Promise<Partial<IContract>> {
    const author = await this._getUser(payload.authorEmail);
    logger.info(`AUTHOR ${JSON.stringify(author)}`);

    if (!author) throw new BadRequestError(i18n.t('contract.errorResponses.authorNotFound'));

    const contractCategoryIdQuery = payload.contractCategoryId
      ? { categoryId: payload.contractCategoryId }
      : { isDefault: true };

    logger.info(`CONTRACT CATEGORY ${JSON.stringify(contractCategoryIdQuery)}`);

    const contractCategory = await this.contractCategoryService.read(contractCategoryIdQuery);
    logger.info(`CONTRACT CATEGORY FETCHED ${JSON.stringify(contractCategory)}`);
    if (!contractCategory) throw new NotFoundError(i18n.t('contractCategory.errorResponses.notFound'));

    const dto = this.contractDTO.create({
      contractCategoryId: contractCategory?.categoryId,
      authorId: author.id as string,
      authorEmail: payload.authorEmail,
      recipientEmail: payload.recipientEmail,
    });

    logger.info(`ContractCategoryService.createContractCategory payload: ${JSON.stringify(dto)}`);

    const createContract = (await this.contractRepository.create(dto as IContract)) as IContract;

    return this.contractPresenter.serialize(createContract, this.contractAccessibleProperties);
  }

  public async update(query: IReadContract, payload: IUpdateContract): Promise<Partial<IContract>> {
    const author = await this._getUser(payload.authorEmail as string);

    if (!author) throw new BadRequestError(i18n.t(translations.user.notFound));
    const dto = this.contractDTO.update({ ...payload, authorId: author.id as string });

    const existingContract = await this.contractRepository.findOne({ id: query.id });
    if (!existingContract) {
      throw new BadRequestError(translations.contract.responses.notAllowedAccess);
    }
    const updatedContract = (await this.contractRepository.update({ id: query.id }, dto)) as IContract;

    if (payload.inviteeEmail) {
      await this.inviteRecipient({
        userEmail: payload.authorEmail,
        authorId: author.id as string,
        contractId: query.id as string,
        inviteeEmail: payload.inviteeEmail,
      });
    }
    return this.contractPresenter.serialize(updatedContract, this.contractAccessibleProperties);
  }

  public async read(query: IReadContract): Promise<Partial<IContract> | null> {
    const contract = await this.contractRepository.findOne(query);
    if (!contract) {
      return null;
    }
    return this.contractPresenter.serialize(contract, this.contractAccessibleProperties);
  }

  public async readMany(payload: { query: IReadContract; userEmail: string }): Promise<Partial<IContract>[]> {
    const { query, userEmail } = payload;
    const user = (await this._getUser(userEmail)) as IUser;
    let contractList: IContract[] = [];

    if (!_.isEmpty(query)) {
      if (_.has(query, 'ids')) {
        const ids = query.ids?.split(',');
        const queryObj = { ids };
        contractList = await this.contractRepository.findByIdList(queryObj);
      } else {
        contractList = await this.contractRepository.find(query);
      }
    } else {
      const authorContracts = await this.contractRepository.find({ authorId: user.id });
      const recipientContracts = await this.contractRepository.find({ recipientId: user.id });
      const uniqueList = new Set([...recipientContracts]);
      const uniqueRecipientContractList = Array.from(uniqueList);
      contractList = [...authorContracts, ...uniqueRecipientContractList];
    }

    return contractList.map((contract) =>
      this.contractPresenter.serialize(contract, this.contractAccessibleProperties),
    );
  }

  public async signAgreement(payload: IContractSignature): Promise<Partial<IContract>> {
    const user = await this._getUser(payload.userEmail as string);

    const contract = await this.read({ id: payload.contractId });

    if (!contract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));

    const isRecipient = contract.recipientId === user.id;

    logger.info(`Contract response ${JSON.stringify(contract)}`);

    if (!isRecipient && !contract.hasRecipientSigned) {
      throw new BadRequestError(i18n.t(translations.contract.responses.recipientNotSigned));
    }

    const dto = this.contractDTO.signContract({
      ...payload,
      signature: `${user.firstName} ${user.lastName}`,
    });

    const query = { id: dto.contractId };
    const update = {
      [isRecipient ? 'recipientSignature' : 'authorSignature']: dto.signature,
      [isRecipient ? 'recipientSignatureDate' : 'authorSignatureDate']: dto.signatureDate,
    };
    const updatedContract = await this._editContract(query, update);

    const otherPartyId = isRecipient ? contract.authorId : contract.recipientId;

    const otherParty = await this._getUserById(otherPartyId as string);

    if (!updatedContract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));

    logger.info(`updated contract ${updatedContract}`);

    const emailContent = generateEmailTemplate({
      template: EmailTemplate.CONTRACT_SIGNATURE,
      payload: {
        user: otherParty.firstName,
        signedUser: `${user.firstName} ${user.lastName}`,
        link: `${contract.id}/overview`,
      },
    });

    this.emailService.send({
      recipient: otherParty.email || '',
      content: emailContent,
    });

    logger.info(`created recipient ${JSON.stringify(otherParty)}`);

    return this.contractPresenter.serialize(updatedContract as IContract, this.contractAccessibleProperties);
  }

  public async inviteRecipient(payload: IInviteRecipient): Promise<Partial<IContract>> {
    logger.info(`invite recipient payload ${JSON.stringify(payload)}`);
    const user = await this._getUser(payload.userEmail as string);

    const dto = this.contractDTO.inviteRecipient({ ...payload, authorId: user.id as string });
    logger.info(`contract invitation dto ${JSON.stringify(dto)}`);

    const contract = await this.contractRepository.findOne({ id: dto.contractId });

    if (!contract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));
    logger.info(`invite recipient get contract response ${JSON.stringify(contract)}`);

    const query = { id: dto.contractId };
    const update = {
      inviteeEmail: dto.inviteeEmail,
      invitationDate: dto.invitationDate,
    };

    const updatedContract = await this._editContract(query, update);

    if (!updatedContract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));
    logger.info(`updated contract ${JSON.stringify(updatedContract)}`);

    const recipientAuth = await this.authService.create({ email: dto.inviteeEmail as string });
    let recipientDetails;
    if (!recipientAuth) {
      recipientDetails = (await this._getUser(dto.inviteeEmail as string)) as IUser;
    }
    logger.info(`recipient auth ${JSON.stringify(recipientAuth)}`);

    const invitationPayload = {
      authToken: recipientAuth ? recipientAuth.token : undefined,
      contractId: contract.id,
      recipientId: recipientDetails ? recipientDetails.id : undefined,
    };

    const invitationDetails = JSON.stringify(invitationPayload);
    logger.info(`invitation payload ${invitationDetails}`);

    const token = await generateInviteToken(invitationDetails);
    const emailContent = generateEmailTemplate({
      template: EmailTemplate.CONTRACT_INVITATION,
      payload: {
        url: `${dto.contractId}/review?token=${token}`,
        user: dto.inviteeEmail,
      },
    });

    this.emailService.send({ recipient: dto.inviteeEmail || '', content: emailContent });
    logger.info(`created recipient ${JSON.stringify(recipientAuth)}`);

    return this.contractPresenter.serialize(updatedContract as IContract, [
      'authorId',
      'id',
      'inviteeEmail',
      'invitationDate',
    ]);
  }

  public async appeal(payload: ICreateContractAppeal): Promise<Partial<IContractAppeal>> {
    const dto = this.contractAppealDTO.create(payload) as IContractAppeal;

    const newAppeal = await this.contractAppealRepository.create(dto);
    return this.contractAppealPresenter.serialize(newAppeal);
  }

  public async acceptContractInvitation(payload: IAcceptContractInvitation): Promise<Partial<IContract>> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;
    const dto = this.contractDTO.acceptContractInvitation({ ...payload, userId: user.id });

    const contract = await this.read({ id: dto.contractId, inviteeEmail: payload.userEmail });

    if (!contract) throw new NotFoundError(i18n.t(translations.contract.responses.contractNotFound));

    const query = { id: dto.contractId };
    const update = {
      recipientId: dto.userId,
      inviteAcceptanceDate: dto.inviteAcceptanceDate,
    };

    const updatedContract = await this._editContract(query, update);

    await this._createOrderRecipient({ contractId: dto.contractId, recipientId: dto.userId || '' });

    return this.contractPresenter.serialize(updatedContract as IContract, [
      'authorId',
      'id',
      'recipientId',
      'invitationDate',
    ]);
  }

  public async getContractsByUser(email: string): Promise<Array<Partial<IContract>>> {
    const user = await this._getUser(email);

    const dto = this.contractDTO.getContracts({ authorId: user.id });

    const userContracts = await this.contractRepository.find({ dto });

    return userContracts.map((contract) => {
      return this.contractPresenter.serialize(contract, this.contractAccessibleProperties);
    });
  }

  private async _editContract(query: IReadContract, update: IUpdateContract): Promise<Partial<IContract | null>> {
    return await this.contractRepository.update(query, update);
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }

  private async _getUserById(id: string): Promise<IUser> {
    const user = await this.userService.read({ id });

    return user as IUser;
  }

  private async _createOrderRecipient(payload: {
    contractId: string;
    recipientId: string;
  }): Promise<Partial<IOrder> | null> {
    const { contractId, recipientId } = payload;
    const order = await this.orderRepository.findOne({ contractId: contractId });

    const query = { contractId };

    const update = {
      ...(order?.sellerId && { buyerId: recipientId }),
      ...(order?.buyerId && { sellerId: recipientId }),
    };

    const updatedOrder = await this.orderRepository.update(query, update);

    return updatedOrder;
  }
}
