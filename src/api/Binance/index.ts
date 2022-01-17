import axios, {AxiosInstance} from "axios";

const binanceRestClientV3: AxiosInstance = axios.create({
    baseURL: 'https://api.binance.com/api/v3'
})


export {binanceRestClientV3}