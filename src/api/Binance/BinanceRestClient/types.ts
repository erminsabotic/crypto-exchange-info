//Mapping only fields that we will use
interface ExchangeInfoResponseV3 {
    symbols: ExchangeInfoSymbol[]
}

interface ExchangeInfoSymbol {
    symbol: string
}

export type {
    ExchangeInfoResponseV3
}