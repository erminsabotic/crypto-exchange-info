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
import {
  BUY_ORDER_TYPE,
  SELL_ORDER_TYPE,
  TABLE_LIMITS,
} from "../../../utils/constants";
import { calculateDecimals } from "../../../utils/orderArrays";
import { ITradingPair } from "../TradingPairSelector";

interface IOrderTablesProps {
  tradingPair: ITradingPair;
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

const OrderTables: FC<IOrderTablesProps> = ({ tradingPair }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] =
    useState<string>("");
  const [webSocket, _setWebSocket] = useState<WebSocket>();
  const [tableLimit, setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, setDecimals] = useState<number>(0);
  const [tablesData, _setTablesData] = useState<ITablesData>({
    buys: [],
    sells: [],
  });
  const [decimalOptions, _setDecimalOptions] = useState<IDecimalOption[]>([]);

  const tablesDataRef = useRef(tablesData);
  const decimalOptionsRef = useRef(decimalOptions);
  const webSocketRef = useRef(webSocket);

  const setTablesData = (data: ITablesData) => {
    tablesDataRef.current = data;
    _setTablesData(data);
  };

  const setDecimalOptions = (data: IDecimalOption[]) => {
    decimalOptionsRef.current = data;
    _setDecimalOptions(data);
  };

  const setWebSocket = (data: WebSocket) => {
    webSocketRef.current = data;
    _setWebSocket(data);
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
        await updateBuyAndSellOrderData(initialData.bids, initialData.asks);
        const ws = await subscribeToDepthChannel(
          tradingPair.symbol.toLowerCase(),
          depthChannelOnMessageEvent
        );
        setWebSocket(ws);
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();
    return () => webSocketRef.current?.close();
  }, [tradingPair]);

  const buyTable = () => {
    return (
      <OrderTable
        type={BUY_ORDER_TYPE}
        data={tablesData.buys}
        decimals={decimals}
        limit={tableLimit}
        tradingPair={tradingPair}
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
        tradingPair={tradingPair}
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
        <Grid
          item
          xs={2}
          style={{ display: shouldDisplayBuyTable ? "block" : "none" }}
        />
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
