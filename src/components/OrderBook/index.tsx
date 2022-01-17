import {FC, useEffect, useState} from "react";
import {Container, List, ListItem, Typography} from "@material-ui/core";
import useStyles from "./styles";
import {getExchangeInfo} from "../../api/Binance/BinanceRestClient";
import {ExchangeInfoResponseV3} from "../../api/Binance/BinanceRestClient/types";

interface OrderBookProps {}

const OrderBook: FC<OrderBookProps> = () => {
    const classes = useStyles()
    const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfoResponseV3|undefined>(undefined)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setExchangeInfo((await getExchangeInfo()));
            } catch (e) {
                console.log("error occurred")
            }

        }

        fetchData()
    }, [])

    // const ws = new WebSocket("wss://stream.binance.com:9443/ws/ETHBTC@aggTrade")
    //
    // const apiCall = {
    //     method: "SUBSCRIBE",
    //     params: [
    //         'btcusdt@aggTrade'
    //     ],
    //     id: 1
    // };
    //
    // ws.onopen = (event) => {
    //     ws.send(JSON.stringify(apiCall));
    // };
    //
    // ws.onmessage = function (event) {
    //     const json = JSON.parse(event.data);
    //     console.log(`[message] Data received from server: ${json}`);
    //     try {
    //             console.log(json)
    //     } catch (err) {
    //         // whatever you wish to do with the err
    //     }
    //
    // };

    return (
        <div className={classes.container}>
            <Container maxWidth="md">
                <Typography variant="h2" align="center">Order Book</Typography>
                {exchangeInfo?
                    <List>
                        {exchangeInfo.symbols.map((symbol) => (
                            <ListItem key={symbol.symbol}>{symbol.symbol}</ListItem>
                        ))}
                    </List>
                    : null}

            </Container>
        </div>

    )
}

export default OrderBook