//Mapping only fields that we will use
interface IExchangeInfoResponseV3 {
  symbols: IExchangeInfoSymbol[];
}

interface IExchangeInfoSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  quoteAsset: string;
}

interface IDepthResponseV1 {
  lastUpdateId: number;
  asks: [string, string][];
  bids: [string, string][];
}

export type { IDepthResponseV1, IExchangeInfoResponseV3, IExchangeInfoSymbol };
