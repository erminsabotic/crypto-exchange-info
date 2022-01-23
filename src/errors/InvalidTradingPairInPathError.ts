class InvalidTradingPairInPathError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidTradingPairInPathError.prototype);
  }
}

export default InvalidTradingPairInPathError;
