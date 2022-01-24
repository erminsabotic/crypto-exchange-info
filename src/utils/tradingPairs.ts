import {
  TRADING_PAIR_LABEL_SEPARATOR,
  TRADING_PAIR_PRICE_FILTER_TYPE,
  TRADING_PAIR_STATUS,
} from "./constants";
import { IExchangeInfoResponseV3 } from "../api/Binance/BinanceRestClient/types";
import { stringCompareFunctionForDescendingOrder } from "./sortCompares";
import InvalidTradingPairInPathError from "../errors/InvalidTradingPairInPathError";
import TradingPairNotFound from "../errors/TradingPairNotFound";
import { ITradingPair } from "../components/OrderBookPage/TradingPairSelector";

/**
 * Validation for trading pair label
 * e.g.
 *  BTC_USDT - valid
 *  BTCUSDT - invalid
 *
 * @param tradingPairLabel
 */
const isValidTradingPairLabel: (tradingPairLabel: string) => boolean = (
  tradingPairLabel
) => {
  return tradingPairLabel.split(TRADING_PAIR_LABEL_SEPARATOR).length === 2;
};

/**
 * Generates trading pair object from trading pair label
 *
 * NOTE: tick size must be obntained from the API
 * @param tradingPairInPath
 */
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
    tickSize: undefined,
  };
};

/**
 * Searches trading pair list to find specified trading pair
 *
 * @param tradingPair
 * @param tradingPairItems
 */
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

/**
 * Formats exchange info response and return list of trading pair objects
 *
 * @param symbols
 */
const formatExchangeInfoResponse: (
  response: IExchangeInfoResponseV3
) => ITradingPair[] = ({ symbols }) => {
  return symbols
    .filter(({ status }) => status === TRADING_PAIR_STATUS)
    .sort((current, next) =>
      stringCompareFunctionForDescendingOrder(current.symbol, next.symbol)
    )
    .map(({ symbol, baseAsset, quoteAsset, filters }) => {
      const filter = filters.find(
        ({ filterType }) => filterType === TRADING_PAIR_PRICE_FILTER_TYPE
      );

      return {
        label: `${baseAsset}${TRADING_PAIR_LABEL_SEPARATOR}${quoteAsset}`,
        symbol: symbol,
        baseAsset: baseAsset,
        quoteAsset: quoteAsset,
        tickSize: filter?.tickSize,
      };
    });
};

export {
  isValidTradingPairLabel,
  formatExchangeInfoResponse,
  createTradingPairFromTradingPairLabel,
  findTradingPairInTradingPairs,
};
