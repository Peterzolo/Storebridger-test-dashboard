import { injectable } from 'inversify';
import { BaseRepository } from '../../../databases/mongodb';
import { IDeliveryDetails, IDeliveryDetailsRepository } from '../../../types/order';
import { DeliveryDetails } from '../models';

export const DELIVERY_DETAILS_REPOSITORY = Symbol('DeliveryDetailsRepository');

@injectable()
export class DeliveryDetailsRepository extends BaseRepository<IDeliveryDetails> implements IDeliveryDetailsRepository {
  constructor() {
    super(DeliveryDetails);
  }
}
