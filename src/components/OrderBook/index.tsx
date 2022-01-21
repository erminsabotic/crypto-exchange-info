import { FC, useEffect, useState } from "react";
import { ExchangeInfoResponseV3 } from "../../api/Binance/BinanceRestClient/types";
import { subscribeToAggregatedTradeChannel } from "../../api/Binance/BinanceWsClient";
import {
  Order,
  OrderStreamResponse,
} from "../../api/Binance/BinanceWsClient/types";
import SymbolSelector from "./SymbolSelector";
import { Container, Grid, Typography } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import OrderTables from "./OrderTables";

interface OrderBookProps {}

const OrderBook: FC<OrderBookProps> = () => {
  const { symbol: symbolInPath } = useParams();
  const [symbol, setSymbol] = useState<string>(symbolInPath as string);
  const [refresh, setRefresh] = useState<boolean>(false);



  useEffect(() => {
    setRefresh(symbol !== symbolInPath);
  }, [symbol, symbolInPath]);

  return (
    <>
      {refresh ? (
          //TODO: move to Symbol selector
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
              <OrderTables symbol={symbol} />
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
};

export default OrderBook;
