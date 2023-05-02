const getElementCoordinates = (element: HTMLElement): DOMRect => {
  if (!element) {
    return new DOMRect();
  }
  return element.getBoundingClientRect();
};

export default getElementCoordinates;
