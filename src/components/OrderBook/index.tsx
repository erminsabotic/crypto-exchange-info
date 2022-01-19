import {FC, useEffect, useState} from "react";
import {Container, Grid, List, ListItem, Typography} from "@material-ui/core";
import useStyles from "./styles";
import {getExchangeInfo} from "../../api/Binance/BinanceRestClient";
import {ExchangeInfoResponseV3} from "../../api/Binance/BinanceRestClient/types";
import {subscribeToAggregatedTradeChannel} from "../../api/Binance/BinanceWsClient";

interface OrderBookProps {}

const OrderBook: FC<OrderBookProps> = () => {
    const classes = useStyles()
    const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfoResponseV3|undefined>(undefined)
    const [tradeChannel, setTradeChannel] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                setExchangeInfo((await getExchangeInfo()));
                const ws = subscribeToAggregatedTradeChannel('btcusdt')
                let messageCount = 0
                ws.onmessage = (event) => {
                    const json = JSON.parse(event.data)
                    try {
                        const tradeChannelData = tradeChannel
                        tradeChannelData.push(json)
                        setTradeChannel(tradeChannelData.slice(2,17))
                        messageCount++
                        // console.log(json)
                    } catch (err) {
                        // whatever you wish to do with the err
                    }
                    if(messageCount > 30) {
                        console.log("close")
                        ws.close()
                    }
                };
            } catch (e) {
                console.log("error occurred")
            }
        }

        fetchData()
    }, [])
    console.log(tradeChannel)
    return (
        <div className={classes.container}>
            <Container maxWidth="md">
                <Typography variant="h2" align="center">Order Book</Typography>
                <Grid container>
                    <Grid item xs={6}>
                        {exchangeInfo?
                            <List>
                                {exchangeInfo.symbols.map((symbol) => (
                                    <ListItem key={symbol.symbol}>{symbol.symbol}</ListItem>
                                ))}
                            </List>
                            : null}
                    </Grid>
                    <Grid item xs={6}>
                        {tradeChannel.length ?
                            <List>
                                {tradeChannel.map((trade, index) => (
                                    <ListItem key={index}>{trade.a}</ListItem>
                                ))}
                            </List>
                            : null}
                    </Grid>
                </Grid>


            </Container>
        </div>

    )
}

export default OrderBook