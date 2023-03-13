import { v4 } from 'uuid';

export const name = v4();
export const email = `${v4()}@gmail.com`;
export const description = v4();
export const address = v4();
export const phone = v4();

export const username = v4();
export const password = v4();

export const existingUsername = v4();

export const mockGetS3Image = jest.fn(
  async (key: string): Promise<boolean | null> => {
    return true;
  },
);

export const mockUploadImageToS3 = jest.fn(
  async (
    image: { originalname: string; buffer: Buffer },
    Key = '',
  ): Promise<string | null> => {
    return image.originalname;
  },
);

jest.mock('../../../../src/database/s3', () => ({
  getS3Image: mockGetS3Image,
  uploadImageToS3: mockUploadImageToS3,
  deleteImageFromS3: () => {
    //
  },
}));
