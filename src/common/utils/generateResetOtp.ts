export const generateOtp = () => {
  const code = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return code;
};
