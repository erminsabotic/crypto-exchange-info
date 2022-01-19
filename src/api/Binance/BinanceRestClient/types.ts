//Mapping only fields that we will use
interface ExchangeInfoResponseV3 {
    symbols: ExchangeInfoSymbol[]
}

interface ExchangeInfoSymbol {
    symbol: string
    baseAsset: string
    quoteAsset: string
}

export type {
    ExchangeInfoResponseV3,
    ExchangeInfoSymbol
}