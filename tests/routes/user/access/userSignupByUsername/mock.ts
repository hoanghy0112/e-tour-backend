export const username = 'username';
export const password = 'password';
export const fullName = 'full name';
export const identity = '123213';
export const isForeigner = false;
export const email = 'fadsf@gmail.com';
export const image = './avatar.png';
export const address = 'afdfasf';
export const phoneNumber = '31231231';
export const identityExpiredAt = new Date();
export const isPhoneVerified = false;
export const isEmailVerified = false;

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

jest.mock('../../../../../src/database/s3', () => ({
  getS3Image: mockGetS3Image,
  uploadImageToS3: mockUploadImageToS3,
  deleteImageFromS3: () => {
    //
  },
}));
