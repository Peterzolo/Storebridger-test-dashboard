import AWS from 'aws-sdk';

import config from '../../config/index';

const s3 = new AWS.S3({
  accessKeyId: config.aws.accessId,
  secretAccessKey: config.aws.accessSecret,
  signatureVersion: config.aws.signature,
  region: config.aws.region,
});

export async function getSignedUrl(key: string, bucketName: string, contentType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const params = { Bucket: bucketName, ContentType: contentType, Key: key };
    s3.getSignedUrl('putObject', params, (err, url) => {
      if (err) reject(err);
      resolve(url);
    });
  });
}
