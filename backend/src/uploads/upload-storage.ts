import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import {
  UPLOAD_DIRS,
  UploadDir,
  absoluteUploadPath,
  buildUploadFilename,
  ensureUploadDir,
  toRelativeUploadPath,
  uploadsRoot,
} from './local-uploads';

export type UploadStorageMode = 'local' | 's3';

export function uploadStorageMode(): UploadStorageMode {
  return process.env.UPLOAD_STORAGE === 's3' ? 's3' : 'local';
}

function s3PublicBaseUrl(): string {
  const configured = process.env.S3_PUBLIC_URL?.replace(/\/$/, '');
  if (configured) return configured;
  const endpoint = (process.env.S3_ENDPOINT ?? 'https://storage.yandexcloud.net').replace(
    /\/$/,
    '',
  );
  const bucket = process.env.S3_BUCKET;
  if (!bucket) {
    throw new Error('S3_BUCKET is required when UPLOAD_STORAGE=s3');
  }
  return `${endpoint}/${bucket}`;
}

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (s3Client) return s3Client;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are required');
  }
  s3Client = new S3Client({
    endpoint: process.env.S3_ENDPOINT ?? 'https://storage.yandexcloud.net',
    region: process.env.S3_REGION ?? 'ru-central1',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
  return s3Client;
}

function s3Bucket(): string {
  const bucket = process.env.S3_BUCKET;
  if (!bucket) throw new Error('S3_BUCKET is required when UPLOAD_STORAGE=s3');
  return bucket;
}

export function buildPublicUploadUrl(relativePath: string): string {
  const rel = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (uploadStorageMode() === 's3') {
    return `${s3PublicBaseUrl()}/${rel}`;
  }
  const base = (process.env.SERVER_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return `${base}/uploads/${rel}`;
}

export function resolvePublicUploadUrl(
  stored: string | null | undefined,
): string | null {
  if (!stored) return null;
  const normalized = stored.replace(/\\/g, '/');
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    return normalized;
  }
  return buildPublicUploadUrl(normalized);
}

function stagingDir(): string {
  const dir = path.join(os.tmpdir(), 'questflow-upload-staging');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function stagingPathForUpload(relativePath: string): string {
  const rel = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (uploadStorageMode() === 's3') {
    return path.join(stagingDir(), path.basename(rel));
  }
  const abs = absoluteUploadPath(rel);
  if (!abs) {
    throw new Error(`Invalid upload path: ${relativePath}`);
  }
  const subdir = rel.split('/')[0] as UploadDir;
  if (subdir === UPLOAD_DIRS.userAvatars || subdir === UPLOAD_DIRS.cardAttachments) {
    ensureUploadDir(subdir);
  } else {
    fs.mkdirSync(path.dirname(abs), { recursive: true });
  }
  return abs;
}

async function uploadFileToS3(
  relativePath: string,
  sourceAbsolutePath: string,
  contentType?: string,
): Promise<void> {
  const key = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const body = fs.readFileSync(sourceAbsolutePath);
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: s3Bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function commitUpload(
  relativePath: string,
  stagedAbsolutePath: string,
  contentType?: string,
): Promise<string> {
  const rel = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (uploadStorageMode() === 's3') {
    await uploadFileToS3(rel, stagedAbsolutePath, contentType);
    fs.rmSync(stagedAbsolutePath, { force: true });
  }
  return buildPublicUploadUrl(rel);
}

export async function deleteUploadFile(
  storedOrRelative: string | null | undefined,
): Promise<void> {
  if (!storedOrRelative) return;
  const rel = toRelativeUploadPath(storedOrRelative);
  if (!rel) return;

  if (uploadStorageMode() === 's3') {
    await getS3Client().send(
      new DeleteObjectCommand({
        Bucket: s3Bucket(),
        Key: rel,
      }),
    );
    return;
  }

  const abs = path.join(uploadsRoot(), rel);
  fs.rmSync(abs, { force: true });
}

export { buildUploadFilename, ensureUploadDir, UPLOAD_DIRS, uploadsRoot };
