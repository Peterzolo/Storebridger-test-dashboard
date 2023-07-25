import crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';

export const genCryptoRandomId = (
  length = 10,
  type: 'base64' | 'hex' | 'url-safe' | 'numeric' | 'distinguishable' | 'ascii-printable' | 'alphanumeric' | undefined,
): string => {
  return cryptoRandomString({ length, type });
};

interface UnpackedBuffer {
  iv: Buffer;
  aad: Buffer;
  cipherText: Buffer;
  tag: Buffer;
}

const unpack = (context: string): UnpackedBuffer => {
  // Decode base64
  let buf = Buffer.from(context, 'base64');

  // Get iv length (1 byte)
  const ivLength = buf.readUInt8();
  buf = buf.subarray(1);

  // Get iv
  const iv = buf.subarray(0, ivLength);
  buf = buf.subarray(ivLength);

  // Get aad length (2 bytes)
  const aadLength = buf.readUInt16LE();
  buf = buf.subarray(2);

  // Get aad
  const aad = buf.subarray(0, aadLength);
  buf = buf.subarray(aadLength);

  // Get cipher length (4 bytes)
  const cipherLength = buf.readInt32LE();
  buf = buf.subarray(4);

  // Get cipherText
  const cipherText = buf.subarray(0, cipherLength);

  // Get tag
  const tag = buf.subarray(cipherLength);

  return {
    iv,
    aad,
    cipherText,
    tag,
  };
};

export const decrypt = (context: string, secret: string): Record<string, unknown> => {
  const { iv, aad, cipherText, tag } = unpack(context);
  const decipher = crypto
    .createDecipheriv('aes-256-gcm', crypto.createHash('sha256').update(secret).digest(), iv)
    .setAAD(aad)
    .setAuthTag(tag)
    .setAutoPadding(false);

  const decrypted = Buffer.concat([decipher.update(cipherText), decipher.final()]);

  return JSON.parse(decrypted.toString());
};
