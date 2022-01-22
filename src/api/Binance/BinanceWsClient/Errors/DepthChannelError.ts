class DepthChannelError extends Error {
  constructor(msg: string) {
    super(msg);

    Object.setPrototypeOf(this, DepthChannelError.prototype);
  }
}

export default DepthChannelError;
