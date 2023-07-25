import { inject, injectable } from 'inversify';
import { BadRequestError, logger, verifyBankAccount } from '../../../library/helpers';
import {
  IWalletBeneficiary,
  IWalletBeneficiaryDTO,
  IWalletBeneficiaryPresenter,
  IWalletBeneficiaryRepository,
  IWalletBeneficiaryService,
  IVerifyAccountNumber,
  IReadWalletBeneficiary,
} from '../../../types/wallet';
import { WALLET_BENEFICIARY_DTO } from '../dtos';
import { WALLET_BENEFICIARY_PRESENTER } from '../presenters';
import { WALLET_BENEFICIARY_RESPOSITORY } from '../repositories';
import { USER_SERVICE } from '../../user/services';
import { IUser, IUserService } from '../../../types/user';
import { translations, i18n } from '../../../locales/i18n';

export const WALLET_BENEFICIARY_SERVICE = Symbol('WalletBeneficiaryService');

@injectable()
export class WalletBeneficiaryService implements IWalletBeneficiaryService {
  public constructor(
    @inject(WALLET_BENEFICIARY_DTO) private readonly walletBeneficiaryDTO: IWalletBeneficiaryDTO,
    @inject(WALLET_BENEFICIARY_PRESENTER) private readonly walletBeneficiaryPresenter: IWalletBeneficiaryPresenter,
    @inject(WALLET_BENEFICIARY_RESPOSITORY) private readonly walletBeneficiaryRepository: IWalletBeneficiaryRepository,
    @inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  public async create(payload: IVerifyAccountNumber): Promise<Partial<IWalletBeneficiary>> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;
    const dto = this.walletBeneficiaryDTO.verifyAccount({ ...payload });

    const accountVerificationResponse = await verifyBankAccount({
      accountNumber: dto.accountNumber,
      bankCode: dto.bankCode,
    });
    logger.info(`Account number verification response ${JSON.stringify(accountVerificationResponse)}`);

    if (!accountVerificationResponse)
      throw new BadRequestError(i18n.t(translations.payment.responses.accountNumberVerification.notFound));

    const createBeneficiaryDTO = this.walletBeneficiaryDTO.create({
      accountNumber: dto.accountNumber,
      userId: user.id,
      accountName: accountVerificationResponse.account_name,
      bankCode: dto.bankCode,
      bankName: dto.bankName,
    });
    logger.info(`Create wallet beneficiary dto ${JSON.stringify(createBeneficiaryDTO)}`);

    const walletBeneficiary = await this.walletBeneficiaryRepository.create(createBeneficiaryDTO as IWalletBeneficiary);
    logger.info(`create wallet beneficiary response ${JSON.stringify(walletBeneficiary)}`);

    return this.walletBeneficiaryPresenter.serialize(walletBeneficiary as IWalletBeneficiary, [
      'accountNumber',
      'bankName',
      'accountName',
    ]);
  }

  public async readMany(payload: IReadWalletBeneficiary): Promise<Partial<IWalletBeneficiary>[]> {
    const user = (await this._getUser(payload.userEmail as string)) as IUser;
    const walletBeneficiaries = await this.walletBeneficiaryRepository.find({ userId: user.id });

    return walletBeneficiaries.map((beneficiary) =>
      this.walletBeneficiaryPresenter.serialize(beneficiary, [
        'bankCode',
        'bankName',
        'accountNumber',
        'accountName',
        'bankId',
        'id',
      ]),
    );
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }
}
