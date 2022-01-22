import axios, { AxiosInstance } from "axios";

const binanceRestClientV3: AxiosInstance = axios.create({
  baseURL: "https://api.binance.com/api/v3",
});

const binanceRestClientV1: AxiosInstance = axios.create({
  baseURL: "https://www.binance.com/api/v1",
});

const binanceWsClientV1: (stream: string) => WebSocket = (stream: string) => {
  return new WebSocket(`wss://stream.binance.com:9443/${stream}`);
};

export { binanceRestClientV1, binanceRestClientV3, binanceWsClientV1 };
