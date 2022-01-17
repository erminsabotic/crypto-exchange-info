import {binanceRestClientV3} from "../index";
import {ExchangeInfoResponseV3} from "./types";
import {AxiosResponse} from "axios";

const getExchangeInfo = async (): Promise<ExchangeInfoResponseV3> => {
    const response: AxiosResponse<ExchangeInfoResponseV3> = await binanceRestClientV3.get('/exchangeInfo')

    return response.data
}

export {
    getExchangeInfo
}