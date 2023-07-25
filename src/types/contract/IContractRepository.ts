import { Read, Write } from '../../databases/mongodb';
import { IContract, IContractAppeal, IContractCategory, IContractContentTemplate } from './IContract';

export interface IContractRepository extends Read<IContract>, Write<IContract> {}

export interface IContractCategoryRepository extends Read<IContractCategory>, Write<IContractCategory> {}

export interface IContractContentTemplateRepository
  extends Read<IContractContentTemplate>,
    Write<IContractContentTemplate> {}

export interface IContractAppealRepository extends Read<IContractAppeal>, Write<IContractAppeal> {}
