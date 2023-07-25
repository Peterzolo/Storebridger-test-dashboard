/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosResponse } from 'axios';
import _ from 'lodash';
import { i18n, translations } from '../../locales/i18n';
import config from '../../config';
import { BadRequestError } from './error';
import logger from './logger';

export interface IPaystackInitiatePayment {
  amount: number;
  email: string;
  callBackUrl?: string;
}

export interface IPaystackInitiatePaymentResponse {
  status: true;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference?: string;
  };
}

export interface IPaystackTransactionResponse {
  customer: Customer;
  authorization: Authorization;
  fees: number | null;
  amount: number;
  currency: string;
  transaction_date: string;
  status: string;
  reference: string;
  domain: string;
  metadata: number;
  gateway_response: string;
  message: string | null;
  channel: string;
  ip_address: string;
  plan: string;
}

export interface IAccountVerification {
  account_number: string;
  account_name: string;
  bank_id: string;
}
export interface IPaystackAccountVerification {
  accountNumber: string;
  bankCode: string;
}

export interface IPaystackBank {
  name: string;
  bankId: string;
  code: string;
}
interface Authorization {
  authorization_code: string;
  card_type: string;
  last4: number;
  exp_month: number;
  exp_year: number;
  bin: number;
  bank: string;
  channel: string;
  signature: string;
  reusable: boolean;
  country_code: string;
}

interface Customer {
  email: string;
  integration?: number;
  domain?: string;
  customer_code?: string;
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const initiatePaystackPayment = async (
  payload: IPaystackInitiatePayment,
): Promise<IPaystackInitiatePaymentResponse> => {
  logger.info(`Paystack initalize payment payload ${JSON.stringify(payload)} `);
  try {
    const response: AxiosResponse = await axios.post(
      `${config.paystack.baseUrl}/transaction/initialize`,
      {
        amount: payload.amount * 100,
        email: payload.email,
        callback_url: `${config.frontend.base}${payload.callBackUrl || config.paystack.redirect}`,
      },
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secret}`,
        },
      },
    );

    logger.info(`Paystack initalize payment response ${JSON.stringify(response.data)}`);

    return response.data;
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    throw new BadRequestError(i18n.t(translations.common.responses.notFetched));
  }
};

export const verifyPayStackPayment = async (reference: string): Promise<IPaystackTransactionResponse> => {
  try {
    const response = await axios.get(`${config.paystack.baseUrl}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${config.paystack.secret}`,
      },
    });

    logger.info(`Paystack initalize payment response ${JSON.stringify(response.data)}`);

    return response.data.data;
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    throw new BadRequestError(i18n.t(translations.common.responses.notFetched));
  }
};

export const listOfBanks = async (): Promise<Array<IPaystackBank>> => {
  try {
    const response = await axios.get(`${config.paystack.baseUrl}/bank?currency=NGN`, {
      headers: {
        Authorization: `Bearer ${config.paystack.secret}`,
      },
    });

    logger.info(`get banks paystack response ${JSON.stringify(response.data.data)}`);

    const bankList: Array<IPaystackBank> = _.map(response.data.data, (bank) =>
      _.assign({
        name: bank.name,
        bankId: bank.id,
        code: bank.code,
      }),
    );
    return bankList;
  } catch (error: any) {
    logger.error(JSON.stringify(error.message));
    throw new BadRequestError(i18n.t(translations.common.responses.notFetched));
  }
};

export const verifyBankAccount = async (
  payload: IPaystackAccountVerification,
): Promise<IAccountVerification | null> => {
  try {
    const response = await axios.get(
      `${config.paystack.baseUrl}/bank/resolve?account_number=${payload.accountNumber}&bank_code=${payload.bankCode}`,
      {
        headers: {
          Authorization: `Bearer ${config.paystack.secret}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    logger.error(JSON.stringify(error));
    throw new BadRequestError(i18n.t(translations.common.responses.notFetched));
  }
};
