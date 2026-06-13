import {
  buildPublicUploadUrl,
  resolvePublicUploadUrl,
  uploadStorageMode,
} from '../upload-storage';

describe('upload-storage', () => {
  const env = process.env;

  beforeEach(() => {
    process.env = { ...env };
    delete process.env.UPLOAD_STORAGE;
    delete process.env.S3_PUBLIC_URL;
    delete process.env.S3_BUCKET;
    process.env.SERVER_URL = 'http://test.local';
  });

  afterAll(() => {
    process.env = env;
  });

  it('defaults to local storage mode', () => {
    expect(uploadStorageMode()).toBe('local');
  });

  it('builds local public url', () => {
    expect(buildPublicUploadUrl('user-avatars/1.png')).toBe(
      'http://test.local/uploads/user-avatars/1.png',
    );
  });

  it('builds s3 public url', () => {
    process.env.UPLOAD_STORAGE = 's3';
    process.env.S3_PUBLIC_URL = 'https://storage.yandexcloud.net/questflow-uploads';
    expect(buildPublicUploadUrl('card-attachments/a.webp')).toBe(
      'https://storage.yandexcloud.net/questflow-uploads/card-attachments/a.webp',
    );
  });

  it('resolvePublicUploadUrl keeps absolute urls', () => {
    expect(
      resolvePublicUploadUrl('https://storage.yandexcloud.net/bucket/a.png'),
    ).toBe('https://storage.yandexcloud.net/bucket/a.png');
  });

  it('resolvePublicUploadUrl maps relative paths', () => {
    expect(resolvePublicUploadUrl('user-avatars/a.png')).toBe(
      'http://test.local/uploads/user-avatars/a.png',
    );
  });
});
