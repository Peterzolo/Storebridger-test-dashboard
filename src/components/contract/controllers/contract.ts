import { Request, Response } from 'express';
import inversifyContainer from '../../../ioc/inversify.config';
import { SuccessResponse } from '../../../library/helpers';
import { i18n, translations } from '../../../locales/i18n';
import { CONTRACT_CONTENT_TEMPLATE_SERVICE, CONTRACT_SERVICE } from '../services';
import { IContractContentTemplateService, IContractService } from 'contract';

const container = inversifyContainer();
const contractService = container.get<IContractService>(CONTRACT_SERVICE);
const contractContentTemplateService = container.get<IContractContentTemplateService>(
  CONTRACT_CONTENT_TEMPLATE_SERVICE,
);

export class ContractController {
  public async index(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const query = req.query;
    const outcome = await contractService.readMany({ query, userEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  }

  public async create(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await contractService.create({ ...req.body, authorEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }

  public async signContract(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await contractService.signAgreement({ ...req.body, userEmail: req.email });

    return new SuccessResponse(i18n.t(translations.contract.responses.contractSigned), outcome).send(res);
  }

  public async read(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const id = req.params.id;
    const outcome = await contractService.read({ id });

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  }

  public async update(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const id = req.params.id;
    const outcome = await contractService.update({ id }, { ...req.body, ...(req.email && { authorEmail: req.email }) });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }

  public async acceptContractInvitation(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await contractService.acceptContractInvitation({ ...req.body, userEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.updated), outcome).send(res);
  }

  public async contractContentTemplate(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    const query = { contractId: req.params.contractId };
    const outcome = await contractContentTemplateService.read(query);

    return new SuccessResponse(i18n.t(translations.common.responses.fetched), outcome).send(res);
  }

  public async updateContractContentTemplate(
    req: Request,
    res: Response,
  ): Promise<Response<unknown, Record<string, unknown>>> {
    const payload = req.body;
    const query = { contractId: req.params.contractId };
    const outcome = await contractContentTemplateService.update(query, payload);

    return new SuccessResponse(i18n.t(translations.common.responses.updated), outcome).send(res);
  }

  public async inviteRecipient(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await contractService.inviteRecipient({ ...req.body, userEmail: req.email });

    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }

  public async raiseComplaint(req: Request, res: Response): Promise<Response<unknown, Record<string, unknown>>> {
    const outcome = await contractService.appeal(req.body);
    return new SuccessResponse(i18n.t(translations.common.responses.created), outcome).send(res);
  }
}

export const contractController = new ContractController();
