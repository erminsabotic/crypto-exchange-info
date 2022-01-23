import { SYMBOL_LABEL_SEPARATOR, TRADING_SYMBOL_STATUS } from "./constants";
import {
  IExchangeInfoResponseV3,
  IExchangeInfoSymbol,
} from "../api/Binance/BinanceRestClient/types";
import { stringCompareFunctionForDescendingOrder } from "./sortCompares";
import { ISymbolItem } from "../components/OrderBook";
import InvalidTradingPairInPathError from "../errors/InvalidTradingPairInPathError";
import TradingPairNotFound from "../errors/TradingPairNotFound";

const isValidSymbolInPath: (symbolInPath: string) => boolean = (
  symbolInPath
) => {
  return symbolInPath.split(SYMBOL_LABEL_SEPARATOR).length === 2;
};

const createTradingPairItemFromTradingPairInPath: (
  tradingPairInPath: string
) => ISymbolItem = (tradingPairInPath) => {
  if (!isValidSymbolInPath(tradingPairInPath)) {
    throw new InvalidTradingPairInPathError(
      "symbols.createTraidingPairItemFromTradingPairInPath: Invalid trading pair in path"
    );
  }

  const tradingPairInPathParts: string[] = tradingPairInPath.split(
    SYMBOL_LABEL_SEPARATOR
  );

  return {
    label: `${tradingPairInPathParts[0]}${SYMBOL_LABEL_SEPARATOR}${tradingPairInPathParts[1]}`,
    symbol: `${tradingPairInPathParts[0]}${tradingPairInPathParts[1]}`,
    baseAsset: tradingPairInPathParts[0],
    quoteAsset: tradingPairInPathParts[1],
  };
};

const findTradingPairInTradingPairs: (tradingPair: ISymbolItem, tradingPairItems: ISymbolItem[]) => ISymbolItem = (tradingPair, tradingPairItems) => {
  const pair = tradingPairItems.find(({symbol} ) => symbol === tradingPair.symbol)

  if(!pair) {
    throw new TradingPairNotFound(
        "symbols.findTradingPairInTradingPairs: Trading pair does not exist in trading pairs"
    );
  }

  return pair
}

const formatExchangeInfoResponse: (
  response: IExchangeInfoResponseV3
) => ISymbolItem[] = ({ symbols }) => {
  return symbols
    .filter(({ status }) => status === TRADING_SYMBOL_STATUS)
    .sort((current, next) =>
      stringCompareFunctionForDescendingOrder(current.symbol, next.symbol)
    ).map(({symbol, baseAsset, quoteAsset}) => {
          return {
            label: `${baseAsset}${SYMBOL_LABEL_SEPARATOR}${quoteAsset}`,
            symbol: `${baseAsset}${quoteAsset}`,
            baseAsset: baseAsset,
            quoteAsset: quoteAsset,
          }
      });
};

export {
  isValidSymbolInPath,
  formatExchangeInfoResponse,
  createTradingPairItemFromTradingPairInPath,
  findTradingPairInTradingPairs
};
