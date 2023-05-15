export const EMAIL_REGEX_PATTERN =
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
export const PASSWORD_MIN_LENGTH = 6;
export const DEFAULT_USER_ROLE = 'user';
export const { JWT_SECRET, JWT_EXPIRATION_TIME, JWT_COOKIE_EXPIRE } =
  process.env;
