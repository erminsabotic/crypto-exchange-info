import { binanceWsClientV1 } from "../index";
import { ChannelSettings } from "./types";

const getDepthChannelSettings: (symbol: string) => ChannelSettings = (
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
  const ws = binanceWsClientV1("stream");

  ws.onopen = (event) => {
    ws.send(JSON.stringify(getDepthChannelSettings(symbol)));
  };
  ws.onmessage = onMessageCallback;

  return ws;
};

export { subscribeToDepthChannel };
