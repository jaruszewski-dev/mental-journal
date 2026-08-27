import { ValidationError } from 'class-validator';

import type { FieldError } from '@repo/api-types';

export function mapValidationErrors(errors: ValidationError[]): FieldError[] {
  return errors.flatMap((error) => {
    const current = error.constraints
      ? Object.values(error.constraints).map((message) => ({
          field: error.property,
          message,
        }))
      : [];

    const nested = error.children?.length
      ? mapValidationErrors(error.children)
      : [];

    return [...current, ...nested];
  });
}
