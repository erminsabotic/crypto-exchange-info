class ExchangeInfoError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ExchangeInfoError.prototype);
  }
}

export default ExchangeInfoError;
