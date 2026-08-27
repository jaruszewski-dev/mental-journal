export const ANON_NAME_MIN_LENGTH = 3;
export const ANON_NAME_MAX_LENGTH = 24;
export const ANON_NAME_REGEX = new RegExp(
  `^[a-zA-Z0-9_]{${ANON_NAME_MIN_LENGTH},${ANON_NAME_MAX_LENGTH}}$`,
);

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;
export const PASSWORD_REGEX = new RegExp(
  `^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{${PASSWORD_MIN_LENGTH},${PASSWORD_MAX_LENGTH}}$`,
);
