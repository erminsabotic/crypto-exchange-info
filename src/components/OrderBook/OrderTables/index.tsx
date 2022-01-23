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

interface IDecimalOption {
  amount: number;
  displayText: string;
}
const INITIAL_DEPTH_DATA_LIMIT = 1000;

const OrderTables: FC<IOrderTablesProps> = ({ symbol }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] =
    useState<string>("");
  const [webSocket, setWebSocket] = useState<WebSocket>();
  const [tableLimit, _setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, _setDecimals] = useState<number>(0);
  const [tablesData, _setTablesData] = useState<ITablesData>({
    buys: [],
    sells: [],
  });
  const [decimalOptions, _setDecimalOptions] = useState<IDecimalOption[]>([]);

  const tablesDataRef = useRef(tablesData);
  const tableLimitRef = useRef(tableLimit);
  const decimalsRef = useRef(decimals);
  const decimalOptionsRef = useRef(decimalOptions);

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

  const setDecimalOptions = (data: IDecimalOption[]) => {
    decimalOptionsRef.current = data;
    _setDecimalOptions(data);
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
        // console.log(json);
        // console.log(json.data);
        updateBuyAndSellOrderData(json.data.a, json.data.b);
      }
    } catch (err) {
      console.log(err);
      // whatever you wish  to do with the err
    }
  };

  const resetStateToDefaultValues: () => void = () => {
    setTablesData({ buys: [], sells: [] });
    setDecimalOptions([]);
    setDecimals(0);
    setTableLimit(TABLE_LIMITS[0].amount);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (webSocket) {
          webSocket.close();
          resetStateToDefaultValues();
        }

        const initialData = await getDepth(symbol.symbol, INITIAL_DEPTH_DATA_LIMIT);
        const decimalsArray = calculateDecimals(initialData.asks[0][0]);

        ReactDOM.unstable_batchedUpdates(() => {
          setDecimalOptions(decimalsArray);
          setDecimals(decimalsArray[2].amount);
        });
        await updateBuyAndSellOrderData(initialData.bids, initialData.asks);
        const ws = await subscribeToDepthChannel(
          symbol.symbol.toLowerCase(),
          depthChannelOnMessageEvent
        );
        setWebSocket(ws);
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();
  }, [symbol]);

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

  const shouldDisplayBuyTable: boolean =
    buyAndSellTablesSwitch === BUY_ORDER_TYPE || buyAndSellTablesSwitch === "";
  const shouldDisplaySellTable: boolean =
    buyAndSellTablesSwitch === SELL_ORDER_TYPE || buyAndSellTablesSwitch === "";

  const buyAndSellTables = () => {
    return (
      <Grid container>
        <Grid
          item
          md={5}
          xs={12}
          style={{ display: shouldDisplayBuyTable ? "block" : "none" }}
        >
          {buyTable()}
        </Grid>
        <Grid item xs={2} />
        <Grid
          item
          md={5}
          xs={12}
          style={{ display: shouldDisplaySellTable ? "block" : "none" }}
        >
          {sellTable()}
        </Grid>
      </Grid>
    );
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
        <Grid item xs={12} md={6}>
          <Grid container justifyContent={"flex-end"}>
            <Grid item xs={6} md={4} textAlign={"right"}>
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

      {buyAndSellTables()}
    </>
  );
};

export default OrderTables;
