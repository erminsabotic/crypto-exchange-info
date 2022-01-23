import { ITradingPair } from "../TradingPairSelector";
import { FC, useEffect, useState } from "react";
import { TABLE_LIMITS } from "../../../utils/constants";
import { getDepth } from "../../../api/Binance/BinanceRestClient";
import { calculateDecimals } from "../../../utils/orderArrays";
import ReactDOM from "react-dom";
import { Grid, SelectChangeEvent } from "@mui/material";
import TableLayoutSelector from "./OrderTables/TableLayoutSelector";
import TableLengthSelector from "./OrderTables/TableLengthSelector";
import TableDecimalsSelector from "./OrderTables/TableDecimalsSelector";
import OrderTables from "./OrderTables";

interface IOrderTablesProps {
  tradingPair: ITradingPair;
}

export interface ITablesData {
  buys: [string, string][];
  sells: [string, string][];
}

interface IDecimalOption {
  amount: number;
  displayText: string;
}
const INITIAL_DEPTH_DATA_LIMIT = 1000;

const OrderBook: FC<IOrderTablesProps> = ({ tradingPair }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] =
    useState<string>("");
  const [tablesData, setTablesData] = useState<ITablesData>();
  const [tableLimit, setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, setDecimals] = useState<number>(0);
  const [decimalOptions, setDecimalOptions] = useState<IDecimalOption[]>([]);
  const [displayTables, setDisplayTables] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await getDepth(
          tradingPair.symbol,
          INITIAL_DEPTH_DATA_LIMIT
        );
        const decimalsArray = calculateDecimals(initialData.asks[0][0]);

        ReactDOM.unstable_batchedUpdates(() => {
          setDecimalOptions(decimalsArray);
          setDecimals(decimalsArray[2].amount);
        });
        setTablesData({
          buys: initialData.bids,
          sells: initialData.asks,
        });
        setDisplayTables(true);
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();

    return () => setDisplayTables(false);
  }, [tradingPair]);

  const handleTableLimitChange = (event: SelectChangeEvent<number>) => {
    const tableLimit: number = +event.target.value;
    setTableLimit(tableLimit);
  };

  const handleDecimalsChange = (event: SelectChangeEvent<number>) => {
    const decimals: number = +event.target.value;
    setDecimals(decimals);
  };
  console.log(displayTables);
  return (
    <>
      <Grid container sx={{ pb: 2 }} rowSpacing={{ xs: 2 }}>
        <Grid item xs={12} md={6} textAlign={{ xs: "center", md: "left" }}>
          <TableLayoutSelector
            buyAndSellTablesSwitch={buyAndSellTablesSwitch}
            setBuyAndSellTablesSwitch={setBuyAndSellTablesSwitch}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Grid container justifyContent={"flex-end"}>
            <Grid item xs={6} md={4} textAlign={{ xs: "center", md: "right" }}>
              <TableLengthSelector
                tableLimit={tableLimit}
                handleTableLimitChange={handleTableLimitChange}
              />
            </Grid>
            <Grid item xs={6} md={4} textAlign={"right"}>
              {decimalOptions.length ? (
                <TableDecimalsSelector
                  decimals={decimals}
                  decimalOptions={decimalOptions}
                  handleDecimalsChange={handleDecimalsChange}
                />
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {displayTables && tablesData ? (
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
