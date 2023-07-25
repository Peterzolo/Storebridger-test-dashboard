import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import { CONTRACT_CATEGORY_SERVICE } from '../services';
import { IContractCategoryService } from '../../../types/contract';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n } from '../../../locales/i18n';

const container = inversifyContainer();
const contractCategoryService = container.get<IContractCategoryService>(CONTRACT_CATEGORY_SERVICE);

export const postCreateContractCategory = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await contractCategoryService.create({ ...req.body, createdBy: req.email });

  return new SuccessResponse(i18n.t('contractCategory.create.successResponse.created'), outcome).send(res);
};

export const getContractCategories = async (
  req: Request,
  res: Response,
): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await contractCategoryService.readMany();

  return new SuccessResponse(i18n.t('contractCategory.fetch.successResponse.fetched'), outcome).send(res);
};
