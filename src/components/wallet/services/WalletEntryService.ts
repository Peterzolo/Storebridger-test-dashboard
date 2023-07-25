import { inject, injectable } from 'inversify';
import { IReadWalletEntry } from 'wallet/walletEntry/IWalletEntryDTO';
import { logger } from '../../../library/helpers';
import {
  ICreateWalletEntry,
  IWalletEntry,
  IWalletEntryDTO,
  IWalletEntryPresenter,
  IWalletEntryRepository,
  IWalletEntryService,
} from '../../../types/wallet';
import { WALLET_ENTRY_DTO } from '../dtos';
import { WALLET_ENTRY_PRESENTER } from '../presenters';
import { WALLET_ENTRY_REPOSITORY } from '../repositories';
import { USER_SERVICE } from '../../user/services';
import { IUser, IUserService } from '../../../types/user';

export const WALLET_ENTRY_SERVICE = Symbol('WalletEntryService');

@injectable()
export class WalletEntryService implements IWalletEntryService {
  public constructor(
    @inject(WALLET_ENTRY_DTO) private readonly walletEntryDTO: IWalletEntryDTO,
    @inject(WALLET_ENTRY_PRESENTER) private readonly walletEntryPresenter: IWalletEntryPresenter,
    @inject(WALLET_ENTRY_REPOSITORY) private readonly walletEntryRepository: IWalletEntryRepository,
    @inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  public async create(payload: ICreateWalletEntry): Promise<Partial<IWalletEntry>> {
    const dto = this.walletEntryDTO.create(payload);
    logger.info(`create wallet entry dto payload: ${JSON.stringify(dto)}`);

    const walletEntry = await this.walletEntryRepository.create(dto as IWalletEntry);
    logger.info(`create wallet entry response ${JSON.stringify(walletEntry)}`);

    return this.walletEntryPresenter.serialize(walletEntry as IWalletEntry, ['userId', 'walletId', 'credit', 'debit']);
  }

  public async readMany(payload: IReadWalletEntry): Promise<Partial<IWalletEntry>[]> {
    const { userEmail } = payload;
    const user = await this._getUser(userEmail);

    const walletEntries = await this.walletEntryRepository.find({ userId: user.id });

    return [...walletEntries].map((entry: IWalletEntry) => {
      return this.walletEntryPresenter.serialize(entry, [
        'id',
        'balance',
        'createdAt',
        'debit',
        'credit',
        'type',
        'status',
        'recipientId',
      ]);
    });
  }

  public async readTransactionsByStatus(payload: IReadWalletEntry): Promise<Partial<IWalletEntry>[]> {
    const { userEmail } = payload;
    const user = await this._getUser(userEmail);

    const walletEntries = await this.walletEntryRepository.find({ userId: user.id, status: payload.status });

    return [...walletEntries].map((entry: IWalletEntry) => {
      return this.walletEntryPresenter.serialize(entry, [
        'id',
        'balance',
        'createdAt',
        'debit',
        'credit',
        'type',
        'status',
        'recipientId',
      ]);
    });
  }

  private async _getUser(email: string): Promise<Partial<IUser>> {
    const user = await this.userService.read({ email });

    return user as Partial<IUser>;
  }
}
