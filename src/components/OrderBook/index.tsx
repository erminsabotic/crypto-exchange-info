import { FC, useEffect, useState } from "react";
import { ExchangeInfoResponseV3 } from "../../api/Binance/BinanceRestClient/types";
import { subscribeToAggregatedTradeChannel } from "../../api/Binance/BinanceWsClient";
import {
  Order,
  OrderStreamResponse,
} from "../../api/Binance/BinanceWsClient/types";
import SymbolSelector from "./SymbolSelector";
import { Container, Grid, List, ListItem, Typography } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";

interface OrderBookProps {}

const OrderBook: FC<OrderBookProps> = () => {
  const { symbol: symbolInPath } = useParams();
  const [symbol, setSymbol] = useState<string>(symbolInPath as string);
  const [tradeChannel, setTradeChannel] = useState<Order[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      // try {
      //     const ws = subscribeToAggregatedTradeChannel('btcusdt')
      //     let messageCount = 0
      //     ws.onmessage = (event: MessageEvent) => {
      //         const json: OrderStreamResponse = JSON.parse(event.data)
      //         try {
      //             const tradeChannelData = tradeChannel
      //             tradeChannelData.push(json.data)
      //             setTradeChannel(tradeChannelData.slice(2,17))
      //             messageCount++
      //             // console.log(json)
      //         } catch (err) {
      //             // whatever you wish to do with the err
      //         }
      //         if(messageCount > 30) {
      //             console.log("close")
      //             ws.close()
      //         }
      //     };
      // } catch (e) {
      //     console.log("error occurred")
      // }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setRefresh(symbol !== symbolInPath);
  }, [symbol, symbolInPath]);

  return (
    <>
      {refresh ? (
        <Navigate to={`/order-book/${symbol}`} />
      ) : (
        <Container sx={{ padding: "8 0 6 0" }} maxWidth="md">
          <Typography variant="h2" align="center">
            Order Book
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
            </Grid>
            <Grid item xs={12}>
              {tradeChannel.length ? (
                <List>
                  {tradeChannel.map((trade, index) => (
                    <ListItem key={index}>{trade.a}</ListItem>
                  ))}
                </List>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default OrderBook;
