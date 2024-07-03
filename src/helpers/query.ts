export const parseBoolean = (value: string | undefined) => {
  if (value === "true") {
    return true;
  } else if (value === "false") {
    return false;
  }
};
