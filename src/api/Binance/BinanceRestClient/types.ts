//Mapping only fields that we will use
interface ExchangeInfoResponseV3 {
    symbols: ExchangeInfoSymbol[]
}

interface ExchangeInfoSymbol {
    symbol: string
    baseAsset: string
    quoteAsset: string
}

interface DepthResponseV1 {
    lastUpdateId: number
    asks: [string, string][]
    bids: [string, string][]
}

export type {
    DepthResponseV1,
    ExchangeInfoResponseV3,
    ExchangeInfoSymbol
}