export const RandomCodeGenerate = (): number => {
  const randomNumber = Math.ceil(Math.random() * 90000);
  if (randomNumber > 10000) {
    return randomNumber;
  } else {
    return RandomCodeGenerate();
  }
};
