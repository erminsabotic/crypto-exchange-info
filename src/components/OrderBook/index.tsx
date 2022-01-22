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
  const [refresh, setRefresh] = useState<boolean>(false);
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);

  useEffect(() => {
    if (symbolInPath) {
      const splitSymbolInPath = symbolInPath.split(SYMBOL_LABEL_SEPARATOR);

      if (splitSymbolInPath.length === 2) {
        setSymbol({
          label: `${splitSymbolInPath[0]}${SYMBOL_LABEL_SEPARATOR}${splitSymbolInPath[1]}`,
          symbol: `${splitSymbolInPath[0]}${splitSymbolInPath[1]}`,
          baseAsset: splitSymbolInPath[0],
          quoteAsset: splitSymbolInPath[1],
        });
      } else {
        setNavigateTo404(true);
      }
    } else {
      setNavigateTo404(true);
    }
  }, []);

  useEffect(() => {
    if (symbol) {
      setRefresh(
        `${symbol.baseAsset}${SYMBOL_LABEL_SEPARATOR}${symbol.quoteAsset}` !==
          symbolInPath
      );
    }
  }, [symbol, symbolInPath]);

  if (navigateTo404) {
    return <Navigate to={`/not-found`} />;
  }

  return (
    <Layout>
      {refresh ? (
        //TODO: move to Symbol selector
        <Navigate to={`/order-book/${symbol?.label}`} />
      ) : (
        <Container sx={{ padding: "8 0 6 0" }} maxWidth="md">
          <Typography variant="h2" align="center">
            Order Book
          </Typography>
          <Grid container>
            {symbol ? (
              <>
                <Grid item xs={12}>
                  <SymbolSelector symbol={symbol} setSymbol={setSymbol} />
                </Grid>
                <Grid item xs={12}>
                  <OrderTables symbol={symbol} />
                </Grid>
              </>
            ) : null}
          </Grid>
        </Container>
      )}
    </Layout>
  );
};

export default OrderBook;
