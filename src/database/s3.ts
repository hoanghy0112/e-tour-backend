import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  GetObjectCommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Bucket, region } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';

export const client = new S3Client({
  region: region,
});

export async function getS3Image(
  key: string,
): Promise<GetObjectCommandOutput | null> {
  const command = new GetObjectCommand({
    Bucket,
    Key: key,
  });

  try {
    return await client.send(command);
  } catch (error) {
    return null;
  }
}

export async function uploadImageToS3(
  image: Express.Multer.File,
): Promise<string | null> {
  const uid = uuidv4();
  const ext = image.originalname.split('.').at(-1);
  const imageFileName = `${uid}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: Bucket,
    Key: imageFileName,
    Body: image.buffer,
  });

  try {
    await client.send(command);
    return imageFileName;
  } catch (error) {
    return null;
  }
}

export async function deleteImageFromS3(
  imageFileName: string,
): Promise<boolean> {
  const command = new DeleteObjectCommand({
    Bucket: Bucket,
    Key: imageFileName,
  });

  try {
    await client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}
