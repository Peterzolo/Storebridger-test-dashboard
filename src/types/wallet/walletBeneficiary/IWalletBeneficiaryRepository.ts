import { Write, Read } from '../../../databases/mongodb';
import { IWalletBeneficiary } from './IWalletBeneficiary';

export interface IWalletBeneficiaryRepository extends Read<IWalletBeneficiary>, Write<IWalletBeneficiary> {}
