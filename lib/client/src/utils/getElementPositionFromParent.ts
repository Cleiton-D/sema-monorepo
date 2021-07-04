export const getElementPositionFromParent = (element: HTMLElement) => {
  const { x: elementPositionX } = element.getBoundingClientRect();

  const parent = element.parentElement;
  if (!parent) return elementPositionX;

  const { x: parentPositionX } = parent.getBoundingClientRect();
  return elementPositionX - parentPositionX;
};
