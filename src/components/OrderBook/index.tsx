import { FC, useEffect, useState } from "react";
import SymbolSelector from "./SymbolSelector";
import { Container, Grid, Typography } from "@mui/material";
import { useParams, Navigate } from "react-router-dom";
import OrderTables from "./OrderTables";
import { SYMBOL_LABEL_SEPARATOR } from "../../utils/constants";
import Layout from "../Layout";

interface IOrderBookProps {}

export interface ISymbolItem {
  label: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

const OrderBook: FC<IOrderBookProps> = () => {
  const { symbol: symbolInPath } = useParams();
  const [symbol, setSymbol] = useState<ISymbolItem>();
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);


  if (!symbolInPath || navigateTo404) {
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
                <SymbolSelector
                  symbolInPath={symbolInPath}
                  symbol={symbol}
                  setSymbol={setSymbol}
                />
              </Grid>
              {symbol ? (
                <Grid item xs={12}>
                  <OrderTables symbol={symbol} />
                </Grid>
              ) : null}
            </>
          </Grid>
        </Container>
    </Layout>
  );
};

export default OrderBook;
