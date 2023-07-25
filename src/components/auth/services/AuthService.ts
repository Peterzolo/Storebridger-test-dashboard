import bcrypt from 'bcryptjs';
import { CookieOptions } from 'express';
import { inject, injectable } from 'inversify';
import { FilterQuery, UpdateQuery } from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import moment from 'moment';
import { IAuth, IAuthDTO, IAuthPresenter, IAuthRepository, IAuthService, ICompleteSignup } from '../../../types/auth';
import { AUTH_DTO } from '../dtos';
import { AUTH_PRESENTER } from '../presenters';
import { AUTH_REPOSITORY } from '../repositories';
import {
  AuthFailureError,
  BadRequestError,
  createSingleToken,
  createTokens,
  ForbiddenError,
  generateEmailTemplate,
  generateOTP,
  JWT,
  logger,
  minuteToMilliSec,
  NotFoundError,
  validateTokenData,
} from '../../../library/helpers';
import config from '../../../config';
import { i18n, translations } from '../../../locales/i18n';
import { VERFIFICATION } from '../../../library/constants/smsTemplates';
import { EmailTemplate } from '../../../library/constants/emailTemplate';
import { ICreateAuthOutcome, ILoginOutcome } from '../../../types/auth/IAuthService';
import { USER_SERVICE } from '../../user/services';
import { ICreateUser, IUserService } from 'user';
import { EMAIL_SERVICE, SMS_SERVICE } from '../../notification/services';
import { IEmailService, ISmsService } from 'notification';
import { CONTRACT_REPOSITORY } from '../../contract/repositories';
import { IContract, IContractRepository } from 'contract';
import { ORDER_SERVICE } from '../../order/services';
import { IOrderService } from 'order';
import { OAuthType } from '../../../types/auth/IAuthDTO';

export const AUTH_SERVICE = Symbol('AuthService');

@injectable()
export class AuthService implements IAuthService {
  public constructor(
    @inject(AUTH_DTO) private readonly authDTO: IAuthDTO,
    @inject(AUTH_PRESENTER) private readonly authPresenter: IAuthPresenter,
    @inject(AUTH_REPOSITORY) private readonly authRepository: IAuthRepository,
    @inject(USER_SERVICE) private readonly userService: IUserService,
    @inject(EMAIL_SERVICE) private readonly emailService: IEmailService,
    @inject(SMS_SERVICE) private readonly smsService: ISmsService,
    @inject(CONTRACT_REPOSITORY) private readonly contractRepository: IContractRepository,
    @inject(ORDER_SERVICE) private readonly orderService: IOrderService,
  ) {}

  public async signup(email: string): Promise<Partial<IAuth & { signupCompletionToken?: string }>> {
    const dto = this.authDTO.signup(email);
    logger.info(`signing up with: ${JSON.stringify(dto)}`);
    const auth = await this.findAuth({ email: dto.email });
    logger.info(`auth found: ${JSON.stringify(dto)}`);

    if (auth) {
      if (auth.hasVerifiedEmail && auth.oauthType === OAuthType.GOOGLE) {
        logger.info(`User registered: ${dto.email}`);
        throw new BadRequestError(i18n.t(translations.auth.responses.signup.userRegisterd));
      }
      if (auth.password) {
        throw new BadRequestError(i18n.t(translations.auth.responses.signup.userRegisterd));
      }
      if (auth.hasVerifiedEmail) {
        logger.info(`Email verified: ${dto.email}`);
        const emailVerificationToken = await createSingleToken(auth.id, dto.primaryKey || '');
        logger.info(`emailVerificationToken created: ${JSON.stringify(emailVerificationToken)}`);
        return {
          ...this.authPresenter.serialize(auth as IAuth, ['email', 'hasVerifiedEmail']),
          signupCompletionToken: emailVerificationToken,
        };
      }

      const emailVerificationToken = await createSingleToken(auth.id, dto.primaryKey || '');
      logger.info(`emailVerificationToken created: ${JSON.stringify(emailVerificationToken)}`);
      const emailContent = generateEmailTemplate({
        template: EmailTemplate.SIGNUP_EMAIL_VERIFICATION,
        payload: emailVerificationToken,
      });
      this.emailService.send({ recipient: auth.email, content: emailContent });
      return this.authPresenter.serialize(auth as IAuth, ['email', 'hasVerifiedEmail']);
    }

    const createdAuth = (await this.authRepository.create(dto as IAuth)) as IAuth;
    const emailVerificationToken = await createSingleToken(createdAuth.id, dto.primaryKey || '');

    logger.info(`emailVerificationToken created: ${JSON.stringify(emailVerificationToken)}`);

    const emailContent = generateEmailTemplate({
      template: EmailTemplate.SIGNUP_EMAIL_VERIFICATION,
      payload: emailVerificationToken,
    });
    this.emailService.send({ recipient: createdAuth.email, content: emailContent });

    return this.authPresenter.serialize(createdAuth, ['email', 'hasVerifiedEmail']);
  }

  public async create(payload: { email: string }): Promise<ICreateAuthOutcome | null> {
    const dto = this.authDTO.signup(payload.email);
    const auth = await this.findAuth({ email: dto.email });

    if (auth) {
      if (auth.oauthType === 'LOCAL' && auth.password === undefined) {
        return {
          email: auth.email,
          token: await createSingleToken(auth.id, dto.primaryKey || ''),
        };
      }
      return null;
    }

    const createAuth = await this.authRepository.create(dto as IAuth);
    const emailVerificationToken = await createSingleToken(createAuth.id, dto.primaryKey || '');

    return {
      email: createAuth.email,
      token: emailVerificationToken,
    };
  }

  public async confirmSignupEmail(emailVerificationToken: string): Promise<Partial<IAuth>> {
    const auth = await this._getAuthFromToken(emailVerificationToken);
    logger.info(`auth found: ${JSON.stringify(auth)}`);

    if (!auth) throw new NotFoundError(i18n.t(i18n.t(translations.auth.responses.signup.emailNotFound)));
    if (auth.hasVerifiedEmail) {
      logger.info(i18n.t(translations.auth.responses.signup.signupTokenConfirmed));
      return this.authPresenter.serialize(auth as IAuth, ['email', 'hasVerifiedEmail']);
    }

    const updatedAuth = await this._editAuth({ id: auth.id }, { hasVerifiedEmail: true });

    return this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);
  }

  public async veirfyPhone(payload: { email: string; phoneNumber: string }): Promise<Partial<IAuth>> {
    const auth = await this.findAuth({ email: payload.email });
    if (!auth) throw new NotFoundError(i18n.t(translations.auth.responses.signup.emailNotFound));

    const newOtp = generateOTP();
    const updatedAuth = await this._editAuth(
      { id: auth.id },
      {
        phoneNumber: payload.phoneNumber,
        phoneToken: newOtp,
        phoneTokenExpires: moment(new Date()).add(5, 'minutes').toDate(),
      },
    );

    this.smsService.send({ recipient: payload.phoneNumber, content: newOtp, template: VERFIFICATION });
    return this.authPresenter.serialize(updatedAuth as IAuth, ['phoneNumber', 'hasVerifiedPhone']);
  }

  public async confirmPhone(phoneVerificationToken: string): Promise<Partial<IAuth>> {
    const auth = await this.findAuth({ phoneToken: phoneVerificationToken });

    if (!auth) throw new NotFoundError(i18n.t(translations.auth.responses.signup.invalidToken));

    if (moment(new Date()).isAfter(moment(auth.phoneTokenExpires))) {
      throw new BadRequestError(i18n.t(translations.auth.responses.signup.tokenExpired));
    }

    const updatedAuth = await this._editAuth(
      { id: auth.id },
      {
        hasVerifiedPhone: true,
        phoneToken: null,
        phoneTokenExpires: null,
      },
    );

    return this.authPresenter.serialize(updatedAuth as IAuth, ['phoneNumber', 'hasVerifiedPhone']);
  }

  public async completeSignup(signupPayload: ICompleteSignup, emailVerificationToken: string): Promise<Partial<IAuth>> {
    const auth = await this._getAuthFromToken(emailVerificationToken);
    logger.info(`auth found: ${JSON.stringify(auth)}`);

    if (!auth) throw new NotFoundError(i18n.t(translations.auth.responses.signup.emailNotFound));
    if (auth.password) throw new ForbiddenError(i18n.t(translations.auth.responses.signup.userRegisterd));

    const dto = this.authDTO.completeSignup({ ...signupPayload, email: auth.email });
    const updatedAuth = await this._editAuth({ id: auth.id }, dto);

    await this.userService.create(dto);

    const emailContent = generateEmailTemplate({ template: EmailTemplate.SUCCESSFUL_SIGNUP });
    this.emailService.send({ recipient: auth.email, content: emailContent });

    return this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);
  }

  public async login(payload: { email: string; password: string; contractId?: string }): Promise<ILoginOutcome> {
    const dto = this.authDTO.login(payload);
    logger.info(`login payload ${JSON.stringify(dto)}`);
    const auth = await this.findAuth({ email: dto.email });
    logger.info(`auth response ${JSON.stringify(auth)}`);

    if (!auth) {
      throw new BadRequestError(i18n.t(translations.auth.responses.login.invalidCredentials));
    }

    if (!auth.password) {
      throw new ForbiddenError(i18n.t(translations.auth.responses.login.userNotRegistered));
    }

    logger.info(`authenticated user ${JSON.stringify(auth)}`);

    const passwordMatched = await bcrypt.compare(dto.password, auth.password);
    if (!passwordMatched) throw new AuthFailureError('Authentication failed');

    const updatedAuth = await this._editAuth(
      { id: auth.id },
      { primaryKey: dto.primaryKey, secondaryKey: dto.secondaryKey },
    );

    const tokens = await createTokens(String(auth.id), dto.primaryKey, dto.secondaryKey);

    logger.info('tokens created');

    if (dto.contractId) {
      await this._updateContractRecipientId({ contractId: dto.contractId, email: dto.email });
    }

    const user = this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);

    const cookieOptions = this._generateCookieOptions();

    return { tokens: JSON.stringify(tokens), user, cookieOptions };
  }

  public async logout(authId: string): Promise<void> {
    const auth = await this.findAuth({ id: authId });

    if (!auth) throw new BadRequestError(i18n.t(translations.auth.responses.logout.cannotLogout));
    if (!auth.primaryKey || !auth.secondaryKey)
      throw new BadRequestError(i18n.t(translations.auth.responses.logout.alreadyLogout));

    await this._editAuth({ id: auth.id }, { primaryKey: '', secondaryKey: '' });

    return;
  }

  public async refreshAccessToken(accessToken: string, refreshToken: string): Promise<ILoginOutcome> {
    const dto = this.authDTO.refreshToken(accessToken, refreshToken);
    const accessTokenSub = await this._validateToken(accessToken);
    const auth = await this.findAuth({ id: accessTokenSub });

    if (!auth) throw new AuthFailureError(i18n.t('auth.signup.errorResponses.userNotRegistered'));

    const refreshTokenSub = await this._validateToken(refreshToken);

    if (accessTokenSub !== refreshTokenSub)
      throw new AuthFailureError(i18n.t('auth.signup.errorResponses.tokenError.invalidToken'));

    const updatedAuth = await this._editAuth(
      { id: auth.id },
      { primaryKey: dto.primaryKey, secondaryKey: dto.secondaryKey },
    );

    const tokens = await createTokens(String(updatedAuth?.id), dto.primaryKey, dto.secondaryKey);
    logger.info('tokens refreshed');

    const user = this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);

    const cookieOptions = this._generateCookieOptions();

    return { tokens: JSON.stringify(tokens), user, cookieOptions };
  }

  public async forgotPassword(email: string): Promise<Partial<IAuth>> {
    logger.info(`forgotPassword initiated with: ${JSON.stringify(email)}`);
    const dto = this.authDTO.signup(email);
    const auth = await this.findAuth({ email: dto.email });
    logger.info(`auth found for password reset: ${JSON.stringify(auth)}`);

    if (!auth) throw new NotFoundError(i18n.t('auth.signup.errorResponses.userNotRegistered'));
    if (!auth.password) throw new BadRequestError(i18n.t('auth.signup.errorResponses.userNotRegistered'));

    const resetPasswordToken = await createSingleToken(auth.id, dto.primaryKey || '');

    const emailContent = generateEmailTemplate({
      template: EmailTemplate.PASSWORD_RESET_EMAIL,
      payload: resetPasswordToken,
    });

    this.emailService.send({ recipient: auth.email, content: emailContent });
    logger.info(`resetPasswordToken created: ${JSON.stringify(resetPasswordToken)}`);

    return this.authPresenter.serialize(auth as IAuth, ['email', 'hasVerifiedEmail']);
  }

  public async confirmPasswordReset(emailVerificationToken: string): Promise<Partial<IAuth>> {
    const auth = await this._getAuthFromToken(emailVerificationToken);
    if (!auth) throw new NotFoundError(i18n.t('auth.signup.errorResponses.emailNotFound'));
    if (!auth.password) throw new ForbiddenError(i18n.t('auth.signup.errorResponses.userNotRegistered'));

    return this.authPresenter.serialize(auth as IAuth, ['email', 'hasVerifiedEmail']);
  }

  public async completePasswordReset(token: string, password: string): Promise<Partial<IAuth>> {
    const auth = await this._getAuthFromToken(token);
    if (!auth) throw new NotFoundError(i18n.t('auth.signup.errorResponses.emailNotFound'));
    if (!auth.password) throw new ForbiddenError(i18n.t('auth.signup.errorResponses.userNotRegistered'));

    const dto = this.authDTO.completePasswordReset(password);

    const updatedAuth = await this._editAuth({ id: auth.id }, dto);

    const emailContent = generateEmailTemplate({ template: EmailTemplate.SUCCESSFUL_PASSWORD_RESET });
    this.emailService.send({ recipient: auth.email, content: emailContent });

    return this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);
  }

  public async googleLogin(oauthTokenId: string): Promise<ILoginOutcome> {
    const client = new OAuth2Client(config.googleOauth.clientId);
    logger.info(`client from google login ${JSON.stringify(client)}`);

    const clientId = config.googleOauth.clientId;

    const verify = await client.verifyIdToken({
      idToken: oauthTokenId,
      audience: clientId,
    });

    const googlePayload = verify.getPayload();

    if (!googlePayload || !googlePayload.email_verified) {
      throw new ForbiddenError(i18n.t('auth.signup.errorResponses.emailNotVerified'));
    }

    const dto = this.authDTO.googleLogin(googlePayload, oauthTokenId);

    const auth = await this.findAuth({ email: dto.email });

    if (
      auth &&
      (auth.oauthType === OAuthType.LOCAL ||
        auth.oauthType === OAuthType.FACEBOOK ||
        auth.oauthId === '' ||
        auth.oauthId !== dto.oauthId)
    ) {
      throw new ForbiddenError(i18n.t('auth.signup.errorResponses.not_allowed'));
    }

    if (!auth) {
      const newAuth = {
        email: dto.email,
        oauthTokenId: dto.oauthTokenId,
        oauthType: dto.oauthType,
        oauthId: dto.oauthId,
        hasVerifiedEmail: true,
        primaryKey: dto.primaryKey,
        secondaryKey: dto.secondaryKey,
      } as IAuth;

      const createdAuth = await this.authRepository.create(newAuth);
      const newUser = {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
      } as ICreateUser;

      await this.userService.create(newUser);
      const tokens = await createTokens(createdAuth.id as string, dto.primaryKey, dto.secondaryKey);
      const user = this.authPresenter.serialize(createdAuth as IAuth, ['email', 'hasVerifiedEmail']);
      const cookieOptions = this._generateCookieOptions();
      return { tokens: JSON.stringify(tokens), user, cookieOptions };
    }

    const updatedAuth = await this._editAuth(
      { _id: auth.id },
      { primaryKey: dto.primaryKey, secondaryKey: dto.secondaryKey },
    );
    const user = this.authPresenter.serialize(updatedAuth as IAuth, ['email', 'hasVerifiedEmail']);
    const tokens = await createTokens(updatedAuth?._id as string, dto.primaryKey, dto.secondaryKey);
    const cookieOptions = this._generateCookieOptions();
    return { tokens: JSON.stringify(tokens), user, cookieOptions };
  }

  public async findAuth(query: Record<string, unknown>): Promise<IAuth | null> {
    logger.info(`find auth initiated with: ${JSON.stringify(query)}`);
    return (await this.authRepository.findOne(query)) as IAuth | null;
  }

  private async _updateContractRecipientId(payload: { contractId: string; email: string }): Promise<IContract | null> {
    logger.info(`_updateContractRecipientId initiated with: ${JSON.stringify(payload)}`);
    const user = await this.userService.read({ email: payload.email });

    logger.info(`update contract recipientId initiated with: ${JSON.stringify(user)}`);
    const query = { id: payload.contractId };
    const update = { recipientId: user.id as string, inviteAcceptanceDate: new Date() };

    const contract = await this.contractRepository.update(query, update);

    await this.orderService.createRecipient({ recipientId: user.id as string, contractId: payload.contractId });
    return contract;
  }

  private async _editAuth(query: FilterQuery<IAuth>, update: UpdateQuery<IAuth>): Promise<IAuth | null> {
    const auth = await this.authRepository.update(query, update);

    return auth;
  }

  private async _getAuthFromToken(token: string): Promise<IAuth | null> {
    const authId = await this._validateToken(token);

    logger.info(`_getAuthFromToken authId found: ${JSON.stringify(authId)}`);
    const auth = await this.findAuth({ id: authId });

    return auth;
  }

  private async _validateToken(token: string): Promise<string> {
    logger.info(`validating token: ${token}`);
    const refreshTokenPayload = await JWT.validate(token);

    validateTokenData(refreshTokenPayload);
    logger.info(`refreshTokenPayload.sub: ${refreshTokenPayload.sub}`);

    return refreshTokenPayload.sub;
  }

  private _generateCookieOptions(): CookieOptions {
    const expiryMin = String(config.tokenExpiryInMinutes);
    const expiryTime = moment(new Date()).add(expiryMin, 'minute').format();

    return {
      maxAge: minuteToMilliSec(config.tokenExpiryInMinutes),
      expires: new Date(expiryTime),
      secure: true, // When in production this should be true
      httpOnly: true,
      sameSite: 'lax',
    };
  }
}
