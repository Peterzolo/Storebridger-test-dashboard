import { ContainerModule, interfaces } from 'inversify';
import {
  IWalletBeneficiaryDTO,
  IWalletBeneficiaryPresenter,
  IWalletBeneficiaryRepository,
  IWalletBeneficiaryService,
  IWalletDTO,
  IWalletEntryDTO,
  IWalletEntryPresenter,
  IWalletEntryRepository,
  IWalletEntryService,
  IWalletPresenter,
  IWalletRepository,
  IWalletService,
} from '../../../types/wallet';
import {
  WalletDTO,
  WalletEntryDTO,
  WALLET_DTO,
  WALLET_ENTRY_DTO,
  WalletBeneficiaryDTO,
  WALLET_BENEFICIARY_DTO,
} from '../dtos';
import {
  WalletPresenter,
  WALLET_PRESENTER,
  WALLET_ENTRY_PRESENTER,
  WalletEntryPresenter,
  WalletBeneficiaryPresenter,
  WALLET_BENEFICIARY_PRESENTER,
} from '../presenters';
import {
  WalletRepository,
  WALLET_REPOSITORY,
  WALLET_ENTRY_REPOSITORY,
  WalletEntryRepository,
  WALLET_BENEFICIARY_RESPOSITORY,
  WalletBeneficiaryRepository,
} from '../repositories';
import {
  WalletService,
  WALLET_SERVICE,
  WALLET_ENTRY_SERVICE,
  WalletEntryService,
  WalletBeneficiaryService,
  WALLET_BENEFICIARY_SERVICE,
} from '../services';

export default () => {
  return new ContainerModule((bind: interfaces.Bind) => {
    bind<IWalletDTO>(WALLET_DTO).to(WalletDTO);
    bind<IWalletRepository>(WALLET_REPOSITORY).to(WalletRepository);
    bind<IWalletService>(WALLET_SERVICE).to(WalletService);
    bind<IWalletPresenter>(WALLET_PRESENTER).to(WalletPresenter);
    bind<IWalletEntryDTO>(WALLET_ENTRY_DTO).to(WalletEntryDTO);
    bind<IWalletEntryRepository>(WALLET_ENTRY_REPOSITORY).to(WalletEntryRepository);
    bind<IWalletEntryService>(WALLET_ENTRY_SERVICE).to(WalletEntryService);
    bind<IWalletEntryPresenter>(WALLET_ENTRY_PRESENTER).to(WalletEntryPresenter);

    bind<IWalletBeneficiaryDTO>(WALLET_BENEFICIARY_DTO).to(WalletBeneficiaryDTO);
    bind<IWalletBeneficiaryRepository>(WALLET_BENEFICIARY_RESPOSITORY).to(WalletBeneficiaryRepository);
    bind<IWalletBeneficiaryService>(WALLET_BENEFICIARY_SERVICE).to(WalletBeneficiaryService);
    bind<IWalletBeneficiaryPresenter>(WALLET_BENEFICIARY_PRESENTER).to(WalletBeneficiaryPresenter);
  });
};
