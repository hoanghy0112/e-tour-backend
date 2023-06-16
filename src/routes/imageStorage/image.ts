import express, { Request } from 'express';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

import { v4 as uuidv4 } from 'uuid';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from '../../config';
import {
  client,
  getS3Image,
  uploadImageToS3,
  uploadImageToS3FromURL,
} from '../../database/s3';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import path from 'path';
import Logger from '../../core/Logger';
import { createReadStream, createWriteStream, rmSync, unlinkSync } from 'fs';
import { Readable } from 'stream';
import { BadRequestError } from '../../core/ApiError';
import multer from 'multer';
import { FileRequest, PublicRequest } from '../../types/app-request';

const imageRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

imageRouter.get(
  '/:name',
  validator(schema.getImage, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res) => {
    const filename = req.params.name;

    try {
      const data = await getS3Image(filename);

      if (!data) throw new BadRequestError('File not found');

      const body = data.Body as Readable;

      body.pipe(res);
    } catch (e) {
      return new BadRequestResponse(JSON.stringify(e)).send(res);
    }
  }),
);

imageRouter.post(
  '',
  upload.single('image'),
  asyncHandler(async (req: FileRequest, res) => {
    try {
      const image = req.file;
      const imageId = image ? await uploadImageToS3(image) : '';
      return new SuccessResponse('Upload image successfully', { imageId }).send(
        res,
      );
    } catch (e) {
      return new BadRequestResponse(JSON.stringify(e)).send(res);
    }
  }),
);

imageRouter.post(
  '/base64',
  asyncHandler(async (req: PublicRequest, res) => {
    try {
      const { url } = req.body;
      const ext = url.split(';')[0].split('/')[1];
      const response = await fetch(url);
      const blob = await response.blob();
      // const file = new File([blob], uuidv4(), { type: 'image/png' });
      // const buffer = await file.arrayBuffer();
      // const buffer = await blob.arrayBuffer();
      const image = {
        // originalname: file.name,
        originalname: `${uuidv4()}.${ext}`,
        buffer: blob,
      };
      const imageId = image ? await uploadImageToS3(image) : '';
      return new SuccessResponse('Upload image successfully', { imageId }).send(
        res,
      );
    } catch (e: any) {
      throw new BadRequestError(e?.message);
      // return new BadRequestResponse(JSON.stringify(e)).send(res);
    }
  }),
);

imageRouter.post(
  '/:imageURL',
  asyncHandler(async (req: PublicRequest, res) => {
    try {
      const { imageURL } = req.params;
      console.log({ imageURL });
      const imageId = imageURL ? await uploadImageToS3FromURL(imageURL) : '';
      return new SuccessResponse('Upload image successfully', { imageId }).send(
        res,
      );
    } catch (e) {
      return new BadRequestResponse(JSON.stringify(e)).send(res);
    }
  }),
);

export default imageRouter;
