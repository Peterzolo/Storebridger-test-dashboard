import { inject, injectable } from 'inversify';
import {
  IPayment,
  IPaymentInitiate,
  IPaymentDTO,
  IPaymentPresenter,
  IPaymentRepository,
  IPaymentService,
  IPaymentConfigService,
  IPaymentConfig,
  IReadPayment,
  IUpdatePayment,
  PaymentStatus,
  PaymentType,
  IVerifyAccountNumber,
  IVerifyAccountNumberResponse,
} from '../../../types/payment';
import { PAYMENT_DTO } from '../dtos';
import { PAYMENT_PRESENTER } from '../presenters';
import { PAYMENT_REPOSITORY } from '../repositories/PaymentRepository';
import { IUser, IUserService } from '../../../types/user';
import {
  ICreditWallet,
  IWallet,
  IWalletEntry,
  IWalletEntryRepository,
  IWalletEntryStatus,
  IWalletRepository,
  IWalletTransactionTypes,
} from '../../../types/wallet';
import {
  logger,
  initiatePaystackPayment,
  NotFoundError,
  IPaystackInitiatePaymentResponse,
  IPaystackTransactionResponse,
  IPaystackInitiatePayment,
  verifyPayStackPayment,
  BadRequestError,
  IPaystackBank,
  listOfBanks,
  verifyBankAccount,
} from '../../../library/helpers';
import { PAYMENT_CONFIG_SERVICE } from './PaymentConfigService';
import { USER_SERVICE } from '../../user/services';
import { i18n, translations } from '../../../locales/i18n';
import { CONTRACT_SERVICE } from '../../contract/services';
import { IContractService } from 'contract';
import { WALLET_ENTRY_REPOSITORY, WALLET_REPOSITORY } from '../../../components/wallet/repositories';

export const PAYMENT_SERVICE = Symbol('PaymentService');

@injectable()
export class PaymentService implements IPaymentService {
  public constructor(
    @inject(PAYMENT_DTO) private readonly paymentDTO: IPaymentDTO,
    @inject(PAYMENT_PRESENTER) private readonly paymentPresenter: IPaymentPresenter,
    @inject(PAYMENT_REPOSITORY) private readonly paymentRepository: IPaymentRepository,
    @inject(PAYMENT_CONFIG_SERVICE) private readonly paymentConfigService: IPaymentConfigService,
    @inject(USER_SERVICE) private readonly userService: IUserService,
    @inject(CONTRACT_SERVICE) private readonly contractService: IContractService,
    @inject(WALLET_REPOSITORY) private readonly walletRepository: IWalletRepository,
    @inject(WALLET_ENTRY_REPOSITORY) private readonly walletEntryRepository: IWalletEntryRepository,
  ) {}

  public async initiatePayment(payload: IPaymentInitiate): Promise<Partial<IPayment>> {
    logger.info(`initiate payment payload ${JSON.stringify(payload)}`);
    const user = await this._getUser(payload.email);

    const dto = this.paymentDTO.initiatePayment({ ...payload, userId: user.id as string });
    logger.info(`initiate payment payload: ${JSON.stringify(dto)}`);

    const defaultPaymentConfig = await this._getDefaultPaymentConfig();
    logger.info(`get default payment ${JSON.stringify(defaultPaymentConfig)}`);

    const paymentResponse = await this._initiatePaystackPayment(dto as IPaystackInitiatePayment);

    const createPaymentDTO = this.paymentDTO.create({
      paymentUrl: paymentResponse.data.authorization_url,
      paymentProvider: defaultPaymentConfig.providerCode,
      recipientId: dto.recipientId || '',
      email: dto.email || '',
      userId: dto.userId || '',
      amount: payload.amount,
      paymentType: payload.paymentType,
      paymentReference: paymentResponse.data.reference || '',
      meta: dto.meta || ({} as Map<string, string>),
      accessCode: paymentResponse.data.access_code,
    });
    logger.info(`create payment dto ${JSON.stringify(createPaymentDTO)}`);

    const createPayment = (await this.paymentRepository.create(createPaymentDTO as IPayment)) as IPayment;

    return this.paymentPresenter.serialize(createPayment, ['userId', 'amount', 'email', 'paymentUrl']);
  }

  public async verifyPayment(payload: { reference: string; email: string }): Promise<Partial<IPayment>> {
    const dto = this.paymentDTO.verifyPaymentDTO(payload);
    logger.info(`verify payment DTO ${JSON.stringify(dto)}`);

    const payment = await this.read({ paymentReference: dto.reference });

    if (!payment) throw new NotFoundError(i18n.t(translations.payment.responses.verification.paymentNotFound));

    if (payment.isVerified)
      throw new BadRequestError(i18n.t(translations.payment.responses.verification.paymentAlreadyVerified));

    logger.info(`payment pending verification ${JSON.stringify(payment)}`);

    const verificationResponse = await this._verifyPaystackPayment({ reference: dto.reference || '' });

    logger.info(`verify endpoint response ${JSON.stringify(verificationResponse)}`);

    const updatedPayment = await this._editPayment(
      { paymentReference: verificationResponse.reference },
      {
        status: verificationResponse.status !== 'success' ? PaymentStatus.FAILED : PaymentStatus.PROCESSED,
        paymentProviderStatus: verificationResponse.status || '',
        isVerified: true,
      },
    );
    logger.info(`updated payment ${JSON.stringify(updatedPayment)}`);

    if (payment.paymentType === PaymentType.WALLET) {
      await this._creditWallet({
        amount: payment.amount,
        userId: payment.userId,
        recipientId: payment.userId,
        reference: payload.reference,
        status: verificationResponse.status !== 'success' ? IWalletEntryStatus.FAILED : IWalletEntryStatus.PROCESSED,
      });
    }

    if (payment.paymentType === PaymentType.CONTRACT) {
      await this.contractService.signAgreement({
        contractId: payment.meta.get('contractId') as string,
        userEmail: dto.email,
      });

      await this._creditWallet({
        amount: payment.amount,
        userId: payment.recipientId,
        recipientId: payment.userId,
        contractId: payment.meta.get('contractId') as string,
        reference: payload.reference,
        status: verificationResponse.status !== 'success' ? IWalletEntryStatus.FAILED : IWalletEntryStatus.UPCOMING,
      });
    }

    return this.paymentPresenter.serialize(updatedPayment as IPayment, ['status', 'amount', 'paymentProviderStatus']);
  }

  public async getBanks(): Promise<Array<IPaystackBank>> {
    const response = await listOfBanks();

    return response;
  }

  public async verifyAccountNumber(payload: IVerifyAccountNumber): Promise<IVerifyAccountNumberResponse> {
    const dto = this.paymentDTO.verifyAccountNumber(payload);

    const response = await verifyBankAccount(dto);
    logger.info(`Account number verification response ${JSON.stringify(response)}`);

    if (!response) throw new BadRequestError(i18n.t(translations.payment.responses.accountNumberVerification.notFound));

    return { accountName: response.account_name, accountNumber: response.account_number, bankId: response.bank_id };
  }

  private async _initiatePaystackPayment(payload: IPaystackInitiatePayment): Promise<IPaystackInitiatePaymentResponse> {
    const paymentResponse = await initiatePaystackPayment(payload);
    if (!paymentResponse) {
      logger.info(`paystack payment initialization respone failed`);
      throw new NotFoundError(i18n.t(translations.payment.responses.initiatePayment.initiatePaymentFailed));
    }

    logger.info(`paystack payment initialization respone ${JSON.stringify(paymentResponse)}`);

    return paymentResponse;
  }

  private async _verifyPaystackPayment(payload: { reference: string }): Promise<Partial<IPaystackTransactionResponse>> {
    const paymentResponse = await verifyPayStackPayment(payload.reference);
    if (!paymentResponse) {
      logger.info(`paystack payment verification respone failed`);
      throw new NotFoundError(i18n.t(translations.payment.responses.initiatePayment.initiatePaymentFailed));
    }

    logger.info(`paystack payment initialization respone ${JSON.stringify(paymentResponse)}`);

    return paymentResponse;
  }

  private async _getDefaultPaymentConfig(): Promise<IPaymentConfig> {
    const defaultPaymentConfig = await this.paymentConfigService.read({ isDefault: true });
    if (!defaultPaymentConfig) {
      logger.info(` default payment not found`);
      throw new NotFoundError(i18n.t(translations.paymentConfig.responses.read.paymentConfigNotFound));
    }

    return defaultPaymentConfig;
  }

  public async read(query: Record<string, unknown>): Promise<IPayment | null> {
    return (await this.paymentRepository.findOne(query)) as IPayment | null;
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }

  private async _editPayment(query: IReadPayment, update: IUpdatePayment): Promise<Partial<IPayment | null>> {
    await this.paymentRepository.update(query, update);

    const payment = await this.paymentRepository.findOne(query);

    return payment;
  }

  private async _creditWallet(payload: ICreditWallet): Promise<Partial<IWalletEntry | null>> {
    logger.info(`credit wallet payload ${JSON.stringify(payload)}`);
    const wallet = await this._readWallet({ userId: payload.userId });
    logger.info(`credited user wallet, ${JSON.stringify(wallet)}`);

    const update = { balance: Number(wallet.balance) + Number(payload.amount) };

    if (payload.status !== IWalletEntryStatus.UPCOMING) {
      const query = { userId: payload.userId };
      const updatedWallet = (await this.walletRepository.update(query, update)) as IWallet;
      logger.info(`wallet updated ${JSON.stringify(updatedWallet)}`);
    }

    const walletEntry = await this.walletEntryRepository.create({
      userId: payload.userId,
      walletId: wallet.id,
      credit: payload.amount,
      balance: payload.contractId ? wallet.balance : update.balance,
      reference: payload.reference,
      recipientId: payload.recipientId || '',
      contractId: payload.contractId || undefined,
      type: payload.contractId ? IWalletTransactionTypes.RECEIVE : IWalletTransactionTypes.DEPOSIT,
      status: payload.status,
      debit: 0,
    });

    return walletEntry;
  }

  private async _readWallet(payload: { userId: string }): Promise<IWallet> {
    const wallet = await this.walletRepository.findOne({ userId: payload.userId });
    if (!wallet) {
      return await this.walletRepository.create({ userId: payload.userId, balance: 0 } as IWallet);
    }

    return wallet;
  }
}
