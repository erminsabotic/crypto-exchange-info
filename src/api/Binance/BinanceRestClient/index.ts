import { binanceRestClientV1, binanceRestClientV3 } from "../index";
import { DepthResponseV1, ExchangeInfoResponseV3 } from "./types";
import { AxiosResponse } from "axios";

const getExchangeInfoUrl = () => {
  return "/exchangeInfo";
};

const getDepthUrl: (symbol: string, limit: number) => string = (
  symbol,
  limit
) => {
  return `/depth?symbol=${symbol}&limit=${limit}`;
};

const getExchangeInfo: () => Promise<ExchangeInfoResponseV3> = async () => {
  const response: AxiosResponse<ExchangeInfoResponseV3> =
    await binanceRestClientV3.get(getExchangeInfoUrl());

  return response.data;
};

const getDepth: (
  symbol: string,
  limit: number
) => Promise<DepthResponseV1> = async (symbol, limit) => {
  const response: AxiosResponse<DepthResponseV1> =
    await binanceRestClientV1.get(getDepthUrl(symbol, limit));

  return response.data;
};

export { getDepth, getExchangeInfo };
