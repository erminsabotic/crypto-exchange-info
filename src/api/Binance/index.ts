import axios, { AxiosInstance } from "axios";
import {
  BINANCE_REST_CLIENT_V1_BASE_URL,
  BINANCE_REST_CLIENT_V3_BASE_URL,
  BINANCE_WSS_CLIENT_V1_BASE_URL,
} from "../../utils/constants";

const binanceRestClientV1: AxiosInstance = axios.create({
  baseURL: BINANCE_REST_CLIENT_V1_BASE_URL,
});

const binanceRestClientV3: AxiosInstance = axios.create({
  baseURL: BINANCE_REST_CLIENT_V3_BASE_URL,
});

const binanceWsClientV1: (stream: string) => WebSocket = (stream: string) => {
  return new WebSocket(`${BINANCE_WSS_CLIENT_V1_BASE_URL}/${stream}`);
};

export { binanceRestClientV1, binanceRestClientV3, binanceWsClientV1 };
