import { FC, useState } from "react";
import { Container, Grid, Typography } from "@mui/material";
import {useParams, useNavigate, Navigate} from "react-router-dom";
import OrderTables from "./OrderTables";
import Layout from "../Layout";
import TradingPairSelector, {ITradingPair} from "./TradingPairSelector";

interface IOrderBookProps {}

const OrderBook: FC<IOrderBookProps> = () => {
  const { tradingPair: tradingPairLabel } = useParams();
  const [tradingPair, setTradingPair] = useState<ITradingPair>();
  const [navigateTo404] = useState<boolean>(false);

  if (!tradingPairLabel || navigateTo404) {
    return <Navigate to={`/not-found`} />;
  }

  return (
    <Layout>
      <Container sx={{ padding: "8 0 6 0" }} maxWidth="md">
        <Typography variant="h2" align="center">
          Order Book
        </Typography>
        <Grid container>
          <>
            <Grid item xs={12}>
              <TradingPairSelector
                tradingPairLabel={tradingPairLabel}
                tradingPair={tradingPair}
                setTradingPair={setTradingPair}
              />
            </Grid>
            {tradingPair ? (
              <Grid item xs={12}>
                <OrderTables tradingPair={tradingPair} />
              </Grid>
            ) : null}
          </>
        </Grid>
      </Container>
    </Layout>
  );
};

export default OrderBook;
