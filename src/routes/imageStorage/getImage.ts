import express, { Request } from 'express';
import validator, { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import asyncHandler from '../../helpers/asyncHandler';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { Bucket } from '../../config';
import { client, getS3Image } from '../../database/s3';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import path from 'path';
import Logger from '../../core/Logger';
import { createReadStream, createWriteStream, rmSync, unlinkSync } from 'fs';
import { Readable } from 'stream';
import { BadRequestError } from '../../core/ApiError';

const imageRouter = express.Router();

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

      body
        .pipe(writable)
        .on('finish', () => {
          res.status(200).sendFile(filePath);
        })
        .on('close', () => {
          // Delete temporary file after send it to client
          setTimeout(() => {
            rmSync(filePath, { force: true });
          }, 20000);
        });
    } catch (e) {
      return new BadRequestResponse(JSON.stringify(e)).send(res);
    }
  }),
);

export default imageRouter;
