import bcrypt from "bcryptjs";

const SALT = 6;

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(SALT);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePasswords = async (suppliedPassword: string, storedPassword: string) => {
  return bcrypt.compare(suppliedPassword, storedPassword);
};
