export const R2_S3_CLIENT = Symbol('R2_S3_CLIENT');

export const R2_STORAGE_CONFIG = Symbol('R2_STORAGE_CONFIG');

export type R2StorageConfig = {
  bucket: string;
  endpoint: string;
  publicUrl: string;
};
