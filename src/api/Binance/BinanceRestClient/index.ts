import { binanceRestClientV1, binanceRestClientV3 } from "../index";
import { IDepthResponseV1, IExchangeInfoResponseV3 } from "./types";
import { AxiosError, AxiosResponse } from "axios";
import ExchangeInfoError from "./Errors/ExchangeInfoError";
import DepthError from "./Errors/DepthError";

const getExchangeInfoUrl: () => string = () => {
  return "/exchangeInfo";
};

const getDepthUrl: (symbol: string, limit: number) => string = (
  symbol,
  limit
) => {
  return `/depth?symbol=${symbol}&limit=${limit}`;
};

const getExchangeInfo: () => Promise<IExchangeInfoResponseV3> = async () => {
  try {
    const response: AxiosResponse<IExchangeInfoResponseV3> =
      await binanceRestClientV3.get(getExchangeInfoUrl());

    return response.data;
  } catch (e) {
    const err = e as AxiosError;
    throw new ExchangeInfoError(
      `BinanceRestClient.getExchangeInfo: ${err.message}: Code: ${err.code}`
    );
  }
};

const getDepth: (
  symbol: string,
  limit: number
) => Promise<IDepthResponseV1> = async (symbol, limit) => {
  try {
    const response: AxiosResponse<IDepthResponseV1> =
      await binanceRestClientV1.get(getDepthUrl(symbol, limit));

    return response.data;
  } catch (e) {
    const err = e as AxiosError;
    throw new DepthError(
      `BinanceRestClient.getDepth: ${err.message}: Code: ${err.code}`
    );
  }
};

export { getDepth, getExchangeInfo };
