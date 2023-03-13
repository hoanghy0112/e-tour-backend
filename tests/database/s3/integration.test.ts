import { readFileSync } from 'fs';
import {
  client,
  deleteImageFromS3,
  getS3Image,
  uploadImageToS3,
} from '../../../src/database/s3';
import path from 'path';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { Bucket } from '../../../src/config';

describe('S3 helpers function', () => {
  const FILENAME = 'file.png';
  const file = readFileSync(path.resolve(__dirname, './image.png'));

  const image = {
    originalname: FILENAME,
    buffer: file,
  };

  test.skip('Should create new object', async () => {
    const response = await uploadImageToS3(image, FILENAME);

    expect(response).not.toBeNull();
  });

  test.skip('Should response an object', async () => {
    const response = await getS3Image('image.jpg');

    expect(response).not.toBeNull();
  });

  test.skip('Should delete object', async () => {
    const response = await deleteImageFromS3(FILENAME);

    expect(response).not.toBeFalsy();
  });
});
