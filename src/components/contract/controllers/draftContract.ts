import { Request, Response } from 'express';
import { SuccessResponse } from '../../../library/helpers';
import inversifyContainer from '../../../ioc/inversify.config';
import { i18n, translations } from '../../../locales/i18n';
import { IDraftContractService } from '../../../types/contract';
import { DRAFT_CONTRACT_SERVICE } from '../services/DraftContractService';

const container = inversifyContainer();
const draftContractService = container.get<IDraftContractService>(DRAFT_CONTRACT_SERVICE);

export const createDraft = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await draftContractService.create({ ...req.body, authorEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
};

export const readDrafts = async (req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> => {
  const outcome = await draftContractService.readMany({ userEmail: req.email });

  return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
};
