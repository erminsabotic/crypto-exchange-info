import { binanceWsClientV1 } from "../index";

const subscribeToAggregatedTradeChannel: (
  symbol: string
) => WebSocket = (symbol: string) => {
  const ws = binanceWsClientV1("stream");

  const channelSettings = {
    method: "SUBSCRIBE",
    params: [`${symbol}@depth`],
    id: 1,
  };

  ws.onopen = (event) => {
    ws.send(JSON.stringify(channelSettings));
  };

  return ws
};

export { subscribeToAggregatedTradeChannel };
