import config from '../../config';
import { EmailTemplate, EmailTemplateType } from '../constants/emailTemplate';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

const FRONTEND_BASE_URL = config.frontend.base;
const BACKEND_HOST_URL = config.appHost;

interface IGenerateEmailTemplate {
  template: EmailTemplateType;
  payload?: number | Record<string, unknown> | string;
}

const getTemplateFile = (fileName: string) => {
  return fs.readFileSync(path.resolve(__dirname, `../../views/${fileName}.handlebars`)).toString('utf8');
};

export const generateEmailTemplate = ({ template, payload }: IGenerateEmailTemplate) => {
  let templateString;
  let emailContent;

  switch (template) {
    case EmailTemplate.SIGNUP_EMAIL_VERIFICATION:
      templateString = getTemplateFile('emailVerification');
      emailContent = { verificationUrl: `${FRONTEND_BASE_URL}/auth/confirm-signup?token=${payload}` };
      break;
    case EmailTemplate.SUCCESSFUL_SIGNUP:
      templateString = getTemplateFile('successfulSignup');
      emailContent = { redirectionUrl: `${FRONTEND_BASE_URL}/auth/login` };
      break;
    case EmailTemplate.PASSWORD_RESET_EMAIL:
      templateString = getTemplateFile('passwordResetEmail');
      emailContent = { verificationUrl: `${FRONTEND_BASE_URL}/auth/confirm-password-reset?token=${payload}` };
      break;
    case EmailTemplate.SUCCESSFUL_PASSWORD_RESET:
      templateString = getTemplateFile('successfulPasswordReset');
      emailContent = { redirectionUrl: `${FRONTEND_BASE_URL}/auth/login` };
      break;
    case EmailTemplate.CONTRACT_INVITATION:
      const payloadObj = payload as Record<string, unknown>;
      templateString = getTemplateFile('contractInvitation');
      emailContent = { invitationUrl: `${FRONTEND_BASE_URL}/contract/${payloadObj.url}`, user: payloadObj.user };
      break;
    case EmailTemplate.CONTRACT_SIGNATURE:
      const contractSignaturePayload = payload as Record<string, unknown>;
      templateString = getTemplateFile('contractSignature');
      emailContent = {
        signedUser: contractSignaturePayload.signedUser,
        user: contractSignaturePayload.user,
        signatureUrl: `${FRONTEND_BASE_URL}/contract/${contractSignaturePayload.link}`,
      };
      break;
    default:
      templateString = getTemplateFile('generalTemplate');
      emailContent = { message: 'Storebridger' };
      break;
  }

  const compiledTemplateStr = Handlebars.compile(templateString);

  return compiledTemplateStr({ assetHostUrl: BACKEND_HOST_URL, ...emailContent });
};
