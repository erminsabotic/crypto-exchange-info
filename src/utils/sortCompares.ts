const stringCompareFunctionForDescendingOrder: (
  current: string,
  next: string
) => number = (current, next) => {
  if (current < next) {
    return -1;
  }
  if (current > next) {
    return 1;
  }
  return 0;
};

export { stringCompareFunctionForDescendingOrder };
