import { FC, useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { BUY_ORDER_TYPE, SELL_ORDER_TYPE } from "../../../../utils/constants";
import { subscribeToDepthChannel } from "../../../../api/Binance/BinanceWsClient";
import { IOrderStreamResponse } from "../../../../api/Binance/BinanceWsClient/types";
import { ITradingPair } from "../../TradingPairSelector";
import { ITablesData } from "../index";
import OrderTable from "./OrderTable";
import { useNavigate } from "react-router-dom";

interface IOrderTablesProps {
  buyAndSellTablesSwitch: string;
  tradingPair: ITradingPair;
  decimals: number;
  tableLimit: number;
  initialTablesData: ITablesData;
}

/**
 * Composite component for order tables
 * Communicates with WS and propagates data to buy/sell tables
 *
 * @param buyAndSellTablesSwitch
 * @param tradingPair
 * @param decimals
 * @param tableLimit
 * @param initialTablesData
 */
const OrderTables: FC<IOrderTablesProps> = ({
  buyAndSellTablesSwitch,
  tradingPair,
  decimals,
  tableLimit,
  initialTablesData,
}) => {
  const [webSocket, _setWebSocket] = useState<WebSocket>();
  const [tablesData, _setTablesData] = useState<ITablesData>(initialTablesData);
  const tablesDataRef = useRef(tablesData);
  const webSocketRef = useRef(webSocket);
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);
  const navigate = useNavigate();

  const setTablesData = (data: ITablesData) => {
    tablesDataRef.current = data;
    _setTablesData(data);
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
        updateBuyAndSellOrderData(json.data.a, json.data.b);
      }
    } catch (err) {
      setNavigateTo404(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ws = await subscribeToDepthChannel(
          tradingPair.symbol.toLowerCase(),
          depthChannelOnMessageEvent
        );
        setWebSocket(ws);
      } catch (e) {
        setNavigateTo404(true);
      }
    };

    fetchData();
    return () => webSocketRef.current?.close();
  }, [tradingPair]);

  const shouldDisplayBuyTable: boolean =
    buyAndSellTablesSwitch === BUY_ORDER_TYPE || buyAndSellTablesSwitch === "";
  const shouldDisplaySellTable: boolean =
    buyAndSellTablesSwitch === SELL_ORDER_TYPE || buyAndSellTablesSwitch === "";
  const shouldDisplayBothTables: boolean =
    shouldDisplayBuyTable && shouldDisplaySellTable;

  if (navigateTo404) {
    navigate("/not-found");
  }

  return (
    <Grid
      container
      sx={{
        pb: 5,
        justifyContent: shouldDisplayBothTables ? "space-between" : "center",
      }}
    >
      <Grid
        item
        md={5}
        xs={12}
        sx={{
          pb: { xs: 2 },
          display: shouldDisplayBuyTable ? "block" : "none",
        }}
      >
        <OrderTable
          type={BUY_ORDER_TYPE}
          data={tablesData.buys}
          decimals={decimals}
          limit={tableLimit}
          tradingPair={tradingPair}
        />
      </Grid>
      <Grid
        item
        md={5}
        xs={12}
        sx={{ display: shouldDisplaySellTable ? "block" : "none" }}
      >
        <OrderTable
          type={SELL_ORDER_TYPE}
          data={tablesData.sells}
          decimals={decimals}
          limit={tableLimit}
          tradingPair={tradingPair}
        />
      </Grid>
    </Grid>
  );
};

export default OrderTables;
