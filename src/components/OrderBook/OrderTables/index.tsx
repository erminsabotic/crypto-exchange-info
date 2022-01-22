import { FC, useEffect, useRef, useState } from "react";
import { IOrderStreamResponse } from "../../../api/Binance/BinanceWsClient/types";
import { subscribeToDepthChannel } from "../../../api/Binance/BinanceWsClient";
import { Grid, SelectChangeEvent } from "@mui/material";
import OrderTable from "./OrderTable";
import ReactDOM from "react-dom";
import { getDepth } from "../../../api/Binance/BinanceRestClient";
import TableLayoutSelector from "./TableLayoutSelector";
import TableLengthSelector from "./TableLengthSelector";
import TableDecimalsSelector from "./TableDecimalsSelector";
import { ISymbolItem } from "../index";
import {
  BUY_ORDER_TYPE,
  SELL_ORDER_TYPE,
  TABLE_LIMITS,
} from "../../../utils/constants";
import { calculateDecimals } from "../../../utils/orderArrays";

interface IOrderTablesProps {
  symbol: ISymbolItem;
}

interface ITablesData {
  buys: [string, string][];
  sells: [string, string][];
}

const OrderTables: FC<IOrderTablesProps> = ({ symbol }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] =
    useState<string>("");
  const [tableLimit, _setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, _setDecimals] = useState<number>(0);
  const [tablesData, _setTablesData] = useState<ITablesData>({
    buys: [],
    sells: [],
  });
  const [decimalOptions, setDecimalOptions] = useState<
    { amount: number; displayText: string }[]
  >([]);

  const tablesDataRef = useRef(tablesData);
  const tableLimitRef = useRef(tableLimit);
  const decimalsRef = useRef(decimals);

  const setTablesData = (data: ITablesData) => {
    tablesDataRef.current = data;
    _setTablesData(data);
  };

  const setTableLimit = (data: number) => {
    tableLimitRef.current = data;
    _setTableLimit(data);
  };

  const setDecimals = (data: number) => {
    decimalsRef.current = data;
    _setDecimals(data);
  };

  const updateBuyAndSellOrderData: (
    buyOrders: [string, string][],
    sellOrders: [string, string][]
  ) => void = (buyOrders, sellOrders) => {
    setTablesData({
      buys: buyOrders,
      sells: sellOrders,
    });
  };

  const depthChannelOnMessageEvent: (event: MessageEvent) => void = (
    event: MessageEvent
  ) => {
    const json: IOrderStreamResponse = JSON.parse(event.data);
    try {
      if (json.data) {
        console.log(json.data);
        updateBuyAndSellOrderData(json.data.a, json.data.b);
      }
    } catch (err) {
      console.log(err);
      // whatever you wish  to do with the err
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await getDepth(symbol.symbol, 1000);
        const decimalsArray = calculateDecimals(initialData.asks[0][0]);

        ReactDOM.unstable_batchedUpdates(() => {
          setDecimalOptions(decimalsArray);
          setDecimals(decimalsArray[2].amount);
        });
        await updateBuyAndSellOrderData(initialData.bids, initialData.asks);
        await subscribeToDepthChannel(
          symbol.symbol.toLowerCase(),
          depthChannelOnMessageEvent
        );
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();
  }, []);

  const buyTable = () => {
    return (
      <OrderTable
        type={BUY_ORDER_TYPE}
        data={tablesData.buys}
        decimals={decimals}
        limit={tableLimit}
        symbol={symbol}
      />
    );
  };

  const sellTable = () => {
    return (
      <OrderTable
        type={SELL_ORDER_TYPE}
        data={tablesData.sells}
        decimals={decimals}
        limit={tableLimit}
        symbol={symbol}
      />
    );
  };

  const buyAndSellTables = () => {
    return (
      <Grid container>
        <Grid item md={5} xs={12}>
          {buyTable()}
        </Grid>
        <Grid item xs={2} />
        <Grid item md={5} xs={12}>
          {sellTable()}
        </Grid>
      </Grid>
    );
  };

  const displayOrderTables: () => JSX.Element = () => {
    switch (buyAndSellTablesSwitch) {
      case BUY_ORDER_TYPE:
        return buyTable();
      case SELL_ORDER_TYPE:
        return sellTable();
      default:
        return buyAndSellTables();
    }
  };

  const handleTableLimitChange = (event: SelectChangeEvent<number>) => {
    const tableLimit: number = +event.target.value;
    setTableLimit(tableLimit);
  };

  const handleDecimalsChange = (event: SelectChangeEvent<number>) => {
    const decimals: number = +event.target.value;
    setDecimals(decimals);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} md={6}>
          <TableLayoutSelector
            buyAndSellTablesSwitch={buyAndSellTablesSwitch}
            setBuyAndSellTablesSwitch={setBuyAndSellTablesSwitch}
          />
        </Grid>
        <Grid container xs={12} md={6} justifyContent={"flex-end"}>
          <Grid item xs={6} md={4} align-items={"center"}>
            <TableLengthSelector
              tableLimit={tableLimit}
              handleTableLimitChange={handleTableLimitChange}
            />
          </Grid>
          <Grid item xs={6} md={4}>
            {decimals && decimalOptions.length ? (
              <TableDecimalsSelector
                decimals={decimals}
                decimalOptions={decimalOptions}
                handleDecimalsChange={handleDecimalsChange}
              />
            ) : null}
          </Grid>
        </Grid>
      </Grid>

      {displayOrderTables()}
    </>
  );
};

export default OrderTables;
