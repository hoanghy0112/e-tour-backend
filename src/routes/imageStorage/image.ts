import express, { Request } from 'express';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from '../../config';
import { client, getS3Image, uploadImageToS3 } from '../../database/s3';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import path from 'path';
import Logger from '../../core/Logger';
import { createReadStream, createWriteStream, rmSync, unlinkSync } from 'fs';
import { Readable } from 'stream';
import { BadRequestError } from '../../core/ApiError';
import multer from 'multer';
import { FileRequest } from '../../types/app-request';

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

      const filePath = path.join(__dirname, `temp.${filename.split('.')[1]}`);
      const writable = createWriteStream(filePath);

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

export default imageRouter;
