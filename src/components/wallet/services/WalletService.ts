import { inject, injectable } from 'inversify';
import { IUser, IUserService } from '../../../types/user';
import bcrypt from 'bcryptjs';
import {
  ICreateWalletEntry,
  IGetWalletPaymentUrl,
  IReadWallet,
  IUpdateWallet,
  IWallet,
  IWalletDTO,
  IWalletEntryDTO,
  IWalletEntryService,
  IWalletPresenter,
  IWalletRepository,
  IWalletService,
  ICreditWallet,
  IWalletTransactionTypes,
  IWalletEntryStatus,
  IWalletPaymentUrl,
  IDebitWallet,
  IWalletEntry,
  ICreateWallet,
} from '../../../types/wallet';
import { IPaymentService, IPaymentUrl, PaymentType } from '../../../types/payment';
import { WALLET_DTO, WALLET_ENTRY_DTO } from '../dtos';
import { WALLET_PRESENTER } from '../presenters';
import { WALLET_REPOSITORY } from '../repositories';
import { BadRequestError, logger, NotFoundError } from '../../../library/helpers';
import { i18n } from '../../../locales/i18n';
import { translations } from '../../../locales/i18n';
import { WALLET_ENTRY_SERVICE } from './WalletEntryService';
import { USER_SERVICE } from '../../user/services/UserService';
import { PAYMENT_SERVICE } from '../../payment/services';
import { IWalletPayment } from 'wallet/IWalletDTO';
import { CONTRACT_REPOSITORY } from '../../../components/contract/repositories';
import { IContract, IContractRepository } from '../../../types/contract';

export const WALLET_SERVICE = Symbol('WalletService');

@injectable()
export class WalletService implements IWalletService {
  public constructor(
    @inject(WALLET_DTO) private readonly walletDTO: IWalletDTO,
    @inject(WALLET_PRESENTER) private readonly walletPresenter: IWalletPresenter,
    @inject(WALLET_REPOSITORY) private readonly walletRepository: IWalletRepository,
    @inject(WALLET_ENTRY_SERVICE) private readonly walletEntryService: IWalletEntryService,
    @inject(WALLET_ENTRY_DTO) private readonly walletEntryDTO: IWalletEntryDTO,
    @inject(USER_SERVICE) private readonly userService: IUserService,
    @inject(PAYMENT_SERVICE) private readonly paymentService: IPaymentService,
    @inject(CONTRACT_REPOSITORY) private readonly contractRepository: IContractRepository,
  ) {}

  public async get(payload: { userEmail: string }): Promise<Partial<IWallet>> {
    const user = await this._getUser(payload.userEmail);
    const wallet = (await this.walletRepository.findOne({ userId: user.id })) as IWallet | null;

    if (!wallet) {
      throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    }

    return this.walletPresenter.serialize(wallet as IWallet, ['userId', 'balance']);
  }

  public async read(query: IReadWallet): Promise<Partial<IWallet>> {
    const wallet = (await this.walletRepository.findOne(query)) as IWallet;

    if (!wallet) {
      const newWallet = await this.walletRepository.create({
        userId: query.userId,
        balance: 0,
      } as IWallet);
      return this.walletPresenter.serialize(newWallet, ['userId', 'balance', 'id']);
    }
    return this.walletPresenter.serialize(wallet, ['userId', 'balance', 'id']);
  }

  public async getCreditWalletPaymentUrl(payload: IGetWalletPaymentUrl): Promise<IWalletPaymentUrl> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;

    if (!user) throw new NotFoundError(i18n.t(translations.user.notFound));

    const dto = this.walletDTO.getWalletPaymentUrl({ ...payload, userId: user.id as string });
    const wallet = await this.read({ userId: dto.userId });

    if (!wallet) {
      logger.error(`wallet not found ${JSON.stringify(dto)}`);
      throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    }

    const response = await this.paymentService.initiatePayment({
      amount: dto.amount,
      email: user.email,
      userId: user.id,
      callBackUrl: dto.callBackUrl,
      paymentType: PaymentType.WALLET,
    });

    logger.info(`credit wallet payment get url event response ${JSON.stringify(response)}`);
    return response as IPaymentUrl;
  }

  public async creditWallet(payload: ICreditWallet): Promise<Partial<IWallet>> {
    const user = await this._getUser(payload.userEmail as string);

    const dto = this.walletDTO.updateWalletDTO({ ...payload, userId: user.id as string });
    logger.info(`credit wallet payload ${JSON.stringify(dto)}`);
    const wallet = await this.read({ userId: dto.userId });

    if (!wallet) {
      logger.error(`wallet not found ${JSON.stringify(dto)}`);
      throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    }

    const query = { userId: dto.userId };
    const update = {
      balance: Number(dto.amount) + Number(wallet.balance),
    };

    const creditedWallet = await this._editWallet(query, update);
    if (!creditedWallet) throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    logger.info(`updated wallet ${creditedWallet}`);

    await this._createWalletEntry({
      userId: dto.userId,
      walletId: wallet.id || '',
      credit: dto.amount,
      balance: creditedWallet.balance || 0,
      reference: payload.reference,
      recipientId: user.id || '',
      type: IWalletTransactionTypes.DEPOSIT,
      status: payload.status,
    });

    return this.walletPresenter.serialize(creditedWallet as IWallet, ['balance', 'userId']);
  }

  public async debitWallet(payload: IDebitWallet): Promise<Partial<IWallet>> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;

    if (!user) throw new NotFoundError(i18n.t(translations.user.notFound));

    const dto = this.walletDTO.updateWalletDTO({ amount: payload.amount, userId: user.id as string });
    logger.info(`debit wallet payload ${JSON.stringify(dto)}`);

    const wallet = (await this.read({ userId: dto.userId })) as IWallet;
    if (!wallet) {
      logger.error(`wallet not found for user ${user.id as string}`);
      throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    }

    if (wallet.balance < dto.amount) {
      logger.error(`insufficent balance ${JSON.stringify(wallet.balance)}`);
      throw new BadRequestError(i18n.t(translations.wallet.responses.debitWallet.insufficientBalance));
    }

    const query = { userId: dto.userId };
    const update = { balance: Number(wallet.balance) - Number(dto.amount) };

    const debitedWallet = await this._editWallet(query, update);
    if (!debitedWallet) throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));
    logger.info(`updated wallet ${debitedWallet}`);

    await this._createWalletEntry({
      userId: dto.userId,
      walletId: wallet.id || '',
      debit: dto.amount,
      recipientId: user.id,
      balance: debitedWallet.balance || 0,
      type: IWalletTransactionTypes.WITHDRAWAL,
      status: IWalletEntryStatus.PROCESSED,
    });

    return this.walletPresenter.serialize(debitedWallet as IWallet, ['balance', 'userId']);
  }

  public async getWalletStatus(query: { userEmail: string }): Promise<Record<string, boolean>> {
    const user = await this._getUser(query.userEmail);
    const wallet = await this.walletRepository.findOne({ userId: user.id });

    if (!wallet?.pin) return { status: false };

    return { status: true };
  }

  public async createWallet(payload: ICreateWallet): Promise<Partial<IWallet>> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;
    const dto = await this.walletDTO.create({ ...payload, userId: user.id });
    logger.info(`create wallet payload ${JSON.stringify(dto)}`);

    const wallet = (await this.read({ userId: dto.userId })) as IWallet;
    if (wallet) {
      const updatedWallet = await this._editWallet({ id: wallet.id }, { pin: dto.pin });
      return this.walletPresenter.serialize(updatedWallet as IWallet, ['userId', 'balance']);
    }

    const createdWallet = await this.walletRepository.create(dto as IWallet);
    logger.info(`created wallet response ${JSON.stringify(createdWallet)}`);

    return this.walletPresenter.serialize(createdWallet, ['userId', 'balance']);
  }

  public async walletPayment(payload: IWalletPayment): Promise<Partial<IWallet>> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;
    const dto = await this.walletDTO.walletPaymentDTO({ ...payload, userId: user.id });
    const wallet = await this.walletRepository.findOne({ userId: dto.userId });

    if (!wallet) throw new NotFoundError(i18n.t(translations.wallet.responses.getWallet.walletNotFound));

    await this._pinValidation(dto.pin, wallet.pin);
    if (wallet.balance < dto.amount)
      throw new BadRequestError(i18n.t(translations.wallet.responses.debitWallet.insufficientBalance));

    const contract = await this._readContract(dto.contractId);
    const isRecipient = contract.recipientId === user.id;
    const recipientId = isRecipient ? contract.recipientId : contract.authorId;

    if (recipientId !== user.id && contract.recipientSignature === undefined)
      throw new BadRequestError(i18n.t(translations.contract.responses.recipientNotSigned));

    const query = { userId: dto.userId };
    const updateObj = { balance: wallet.balance - dto.amount };
    const updatedWallet = (await this._editWallet(query, updateObj)) as IWallet;

    await this._createWalletEntry({
      recipientId: recipientId,
      debit: dto.amount,
      userId: dto.userId,
      balance: updatedWallet.balance,
      status: IWalletEntryStatus.PROCESSED,
      type: IWalletTransactionTypes.SENT,
      walletId: updatedWallet.id,
    });

    await this._signContract({
      contractId: dto.contractId,
      signature: `${user.firstName} ${user.lastName}`,
      isRecipient,
    });

    const recipientWallet = (await this.read({ userId: recipientId })) as IWallet;
    const newWalletEntry = await this._createWalletEntry({
      userId: recipientId,
      recipientId: dto.userId,
      walletId: recipientWallet.id,
      balance: recipientWallet.balance,
      credit: dto.amount,
      status: IWalletEntryStatus.PROCESSING,
      type: IWalletTransactionTypes.RECEIVE,
    });

    logger.info(`new wallet creation ${JSON.stringify(newWalletEntry)}`);

    return this.walletPresenter.serialize(updatedWallet, ['userId', 'balance']);
  }

  private async _editWallet(query: IReadWallet, update: IUpdateWallet): Promise<Partial<IWallet | null>> {
    await this.walletRepository.update(query, update);

    const contract = await this.walletRepository.findOne(query);

    return contract;
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }

  private async _createWalletEntry(payload: ICreateWalletEntry): Promise<Partial<IWalletEntry>> {
    const createWalletEntryDTO = this.walletEntryDTO.create(payload);
    logger.info(`debit wallet entry dto ${JSON.stringify(createWalletEntryDTO)}`);

    const walletEntry = await this.walletEntryService.create(createWalletEntryDTO as ICreateWalletEntry);
    logger.info(`wallet entry response : ${JSON.stringify(walletEntry)}`);

    return walletEntry;
  }

  private async _readContract(contractId: string): Promise<IContract> {
    logger.info(`_read contract endpoint payload ${contractId}`);
    const contract = await this.contractRepository.findOne({ id: contractId });

    if (!contract) throw new NotFoundError('Order not found');

    return contract;
  }

  private async _pinValidation(pin: string, comparePin: string): Promise<boolean> {
    const isPinMatch = await bcrypt.compare(pin, comparePin);

    if (!isPinMatch) throw new BadRequestError('Wrong Pin');
    return true;
  }

  private async _signContract(payload: {
    signature: string;
    contractId: string;
    isRecipient: boolean;
  }): Promise<IContract | null> {
    const { contractId, signature, isRecipient } = payload;

    const query = { id: contractId };
    const update = {
      [isRecipient ? 'recipientSignature' : 'authorSignature']: signature,
      [isRecipient ? 'recipientSignatureDate' : 'authorSignatureDate']: new Date(),
    };

    const updatedContract = await this.contractRepository.update(query, update);

    return updatedContract;
  }
}
