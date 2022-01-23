class TradingPairNotFound extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TradingPairNotFound.prototype);
  }
}

export default TradingPairNotFound;
