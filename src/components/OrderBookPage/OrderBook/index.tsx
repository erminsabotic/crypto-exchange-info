import { ITradingPair } from "../TradingPairSelector";
import { FC, useEffect, useState } from "react";
import { TABLE_LIMITS } from "../../../utils/constants";
import { getDepth } from "../../../api/Binance/BinanceRestClient";
import { Grid } from "@mui/material";
import OrderTables from "./OrderTables";
import { useNavigate } from "react-router-dom";
import OrderTableHeader from "./OrderTableHeader";

interface IOrderTablesProps {
  tradingPair: ITradingPair;
}

export interface ITablesData {
  buys: [string, string][];
  sells: [string, string][];
}

/**
 * Pulling a lot of data on initial load because data contains a lot of duplicates that need to be removed
 * Pulls initial data from the depth API
 */
const INITIAL_DEPTH_DATA_LIMIT = 1000;

/**
 * Used as a composite component for order tables an order tables header
 * Calls depth API to get initial order data
 *
 * Passes on different states from the header to the order tables (decimals, tableLimit, initial data)
 *
 * @param tradingPair
 */
const OrderBook: FC<IOrderTablesProps> = ({ tradingPair }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] =
    useState<string>("");
  const [tablesData, setTablesData] = useState<ITablesData>();
  const [tableLimit, setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, setDecimals] = useState<number>();
  const [displayTables, setDisplayTables] = useState<boolean>(false);
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await getDepth(
          tradingPair.symbol,
          INITIAL_DEPTH_DATA_LIMIT
        );
        setTablesData({
          buys: initialData.bids,
          sells: initialData.asks,
        });
        setDisplayTables(true);
      } catch (e) {
        setNavigateTo404(true);
      }
    };

    fetchData();

    return () => setDisplayTables(false);
  }, [tradingPair]);

  if (navigateTo404) {
    navigate("/not-found");
  }

  return (
    <>
      <Grid container sx={{ pb: 2 }} rowSpacing={{ xs: 2 }}>
        <OrderTableHeader
          buyAndSellTablesSwitch={buyAndSellTablesSwitch}
          setBuyAndSellTablesSwitch={setBuyAndSellTablesSwitch}
          tableLimit={tableLimit}
          setTableLimit={setTableLimit}
          decimals={decimals}
          setDecimals={setDecimals}
          tradingPair={tradingPair}
        />
      </Grid>
      {displayTables && tablesData && decimals ? (
        <OrderTables
          buyAndSellTablesSwitch={buyAndSellTablesSwitch}
          tradingPair={tradingPair}
          initialTablesData={tablesData}
          decimals={decimals}
          tableLimit={tableLimit}
        />
      ) : null}
    </>
  );
};

export default OrderBook;
