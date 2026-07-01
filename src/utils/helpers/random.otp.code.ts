export const RandomCodeGenerate = (): string => {
  const randomNumber = Math.ceil(Math.random() * 90000);
  if (randomNumber > 10000) {
    return String(randomNumber);
  } else {
    return RandomCodeGenerate();
  }
};
