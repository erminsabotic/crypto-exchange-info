class DepthError extends Error {
  constructor(msg: string) {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, DepthError.prototype);
  }
}

export default DepthError;
