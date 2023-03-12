import { S3Client } from '@aws-sdk/client-s3';
import { region } from '../config';

export const client = new S3Client({
  region: region,
});
