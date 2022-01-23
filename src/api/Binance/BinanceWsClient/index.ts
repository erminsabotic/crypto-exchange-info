import { binanceWsClientV1 } from "../index";
import { IChannelSettings } from "./types";
import DepthChannelError from "./Errors/DepthChannelError";

const STREAM = "stream";

const getDepthChannelSettings: (symbol: string) => IChannelSettings = (
  symbol
) => ({
  method: "SUBSCRIBE",
  params: [`${symbol}@depth`],
  id: 1,
});

const subscribeToDepthChannel: (
  symbol: string,
  onMessageCallback: (event: MessageEvent) => void
) => Promise<WebSocket> = async (symbol, onMessageCallback) => {
  try {
    const ws = binanceWsClientV1(STREAM);

    ws.onopen = () => {
      ws.send(JSON.stringify(getDepthChannelSettings(symbol)));
    };
    ws.onmessage = onMessageCallback;

    return ws;
  } catch (e) {
    const err = e as Error;
    throw new DepthChannelError(
      `BinanceWsClient.subscribeToDepthChannel: ${err.message}`
    );
  }
};

export { subscribeToDepthChannel };
