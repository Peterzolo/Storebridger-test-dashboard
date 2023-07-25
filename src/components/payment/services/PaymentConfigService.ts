import { inject, injectable } from 'inversify';
import {
  ICreatePaymentConfig,
  IPaymentConfig,
  IPaymentConfigDTO,
  IPaymentConfigPresenter,
  IPaymentConfigRepository,
  IPaymentConfigService,
} from '../../../types/payment';
import { PAYMENT_CONFIG_DTO } from '../dtos';
import { PAYMENT_CONFIG_PRESENTER } from '../presenters';
import { PAYMENT_CONFIG_REPOSITORY } from '../repositories';
import { logger, ForbiddenError, NotFoundError } from '../../../library/helpers';
import { i18n, translations } from '../../../locales/i18n';
import { IUser } from '../../../types/user';
import pubQueryUserGet from '../events/publishers/query.user.get';
import { IReadPaymentConfig, ISetDefaultPaymentConfig, IUpdatePaymentConfig } from 'payment/IPaymentDTO';

export const PAYMENT_CONFIG_SERVICE = Symbol('PaymentConfigService');

@injectable()
export class PaymentConfigService implements IPaymentConfigService {
  public constructor(
    @inject(PAYMENT_CONFIG_DTO) private readonly paymentConfigDTO: IPaymentConfigDTO,
    @inject(PAYMENT_CONFIG_PRESENTER) private readonly paymentConfigPresenter: IPaymentConfigPresenter,
    @inject(PAYMENT_CONFIG_REPOSITORY) private readonly paymentConfigRepository: IPaymentConfigRepository,
  ) {}

  public async create(payload: ICreatePaymentConfig): Promise<Partial<IPaymentConfig>> {
    const creator = await this._getUser(payload.creatorEmail);

    const dto = this.paymentConfigDTO.create({ ...payload, createdBy: creator.id });
    logger.info(`PaymentConfigService.createPaymentConfig payload: ${JSON.stringify(dto)}`);

    const paymentConfig = await this.read({ providerCode: dto.providerCode });

    if (paymentConfig)
      throw new ForbiddenError(i18n.t(translations.paymentConfig.responses.create.paymentConfigExists));

    const createdPaymentConfig = (await this.paymentConfigRepository.create(dto as IPaymentConfig)) as IPaymentConfig;
    logger.info(`payment config created: ${JSON.stringify(createdPaymentConfig)}`);

    return this.paymentConfigPresenter.serialize(createdPaymentConfig, ['name', 'id', 'providerCode']);
  }

  public async setDefultPaymentConfig(payload: ISetDefaultPaymentConfig): Promise<Partial<IPaymentConfig>> {
    const updater = await this._getUser(payload.updaterEmail);

    const dto = this.paymentConfigDTO.setDefaultPaymentConfig({ ...payload, updatedBy: updater.id });

    const paymentConfig = await this.read({ id: dto.id });
    if (!paymentConfig)
      throw new NotFoundError(i18n.t(translations.paymentConfig.responses.read.paymentConfigNotFound));

    const updateExistingDefaultConfig = await this._editPaymentConfig({ isDefault: true }, { isDefault: false });
    logger.info(`exsiting default payment ${JSON.stringify(updateExistingDefaultConfig)}`);

    const defaultPaymentConfig = await this._editPaymentConfig(
      { id: dto.id },
      { isDefault: true, updatedBy: dto.updatedBy },
    );
    logger.info(`default payment ${JSON.stringify(dto)}`);

    return this.paymentConfigPresenter.serialize(defaultPaymentConfig as IPaymentConfig, [
      'name',
      'id',
      'providerCode',
      'isDefault',
    ]);
  }

  public async read(query: Record<string, unknown>): Promise<IPaymentConfig | null> {
    return (await this.paymentConfigRepository.findOne(query)) as IPaymentConfig | null;
  }

  private async _getUser(email: string): Promise<IUser> {
    const user = await pubQueryUserGet({ email });

    return user as IUser;
  }

  private async _editPaymentConfig(
    query: IReadPaymentConfig,
    update: IUpdatePaymentConfig,
  ): Promise<Partial<IPaymentConfig | null>> {
    await this.paymentConfigRepository.update(query, update);

    const paymentConfig = await this.paymentConfigRepository.findOne(query);

    return paymentConfig;
  }
}
