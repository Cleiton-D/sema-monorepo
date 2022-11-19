export const waitTime = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
