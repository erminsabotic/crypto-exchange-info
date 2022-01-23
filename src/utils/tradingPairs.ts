import {
  TRADING_PAIR_LABEL_SEPARATOR,
  TRADING_PAIR_STATUS,
} from "./constants";
import { IExchangeInfoResponseV3 } from "../api/Binance/BinanceRestClient/types";
import { stringCompareFunctionForDescendingOrder } from "./sortCompares";
import InvalidTradingPairInPathError from "../errors/InvalidTradingPairInPathError";
import TradingPairNotFound from "../errors/TradingPairNotFound";
import { ITradingPair } from "../components/OrderBook/TradingPairSelector";

const isValidTradingPairLabel: (tradingPairLabel: string) => boolean = (
  tradingPairLabel
) => {
  return tradingPairLabel.split(TRADING_PAIR_LABEL_SEPARATOR).length === 2;
};

const createTradingPairFromTradingPairLabel: (
  tradingPairInPath: string
) => ITradingPair = (tradingPairInPath) => {
  if (!isValidTradingPairLabel(tradingPairInPath)) {
    throw new InvalidTradingPairInPathError(
      "tradingPairs.createTraidingPairItemFromTradingPairInPath: Invalid trading pair in path"
    );
  }

  const tradingPairInPathParts: string[] = tradingPairInPath.split(
    TRADING_PAIR_LABEL_SEPARATOR
  );

  return {
    label: `${tradingPairInPathParts[0]}${TRADING_PAIR_LABEL_SEPARATOR}${tradingPairInPathParts[1]}`,
    symbol: `${tradingPairInPathParts[0]}${tradingPairInPathParts[1]}`,
    baseAsset: tradingPairInPathParts[0],
    quoteAsset: tradingPairInPathParts[1],
  };
};

const findTradingPairInTradingPairs: (
  tradingPair: ITradingPair,
  tradingPairItems: ITradingPair[]
) => ITradingPair = (tradingPair, tradingPairItems) => {
  const pair = tradingPairItems.find(
    ({ symbol }) => symbol === tradingPair.symbol
  );

  if (!pair) {
    throw new TradingPairNotFound(
      "tradingPairs.findTradingPairInTradingPairs: Trading pair does not exist in trading pairs"
    );
  }

  return pair;
};

const formatExchangeInfoResponse: (
  response: IExchangeInfoResponseV3
) => ITradingPair[] = ({ symbols }) => {
  return symbols
    .filter(({ status }) => status === TRADING_PAIR_STATUS)
    .sort((current, next) =>
      stringCompareFunctionForDescendingOrder(current.symbol, next.symbol)
    )
    .map(({ symbol, baseAsset, quoteAsset }) => {
      return {
        label: `${baseAsset}${TRADING_PAIR_LABEL_SEPARATOR}${quoteAsset}`,
        symbol: symbol,
        baseAsset: baseAsset,
        quoteAsset: quoteAsset,
      };
    });
};

export {
  isValidTradingPairLabel,
  formatExchangeInfoResponse,
  createTradingPairFromTradingPairLabel,
  findTradingPairInTradingPairs,
};
