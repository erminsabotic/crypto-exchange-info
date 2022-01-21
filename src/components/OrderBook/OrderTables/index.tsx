import { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import {
  Order,
  OrderStreamResponse,
} from "../../../api/Binance/BinanceWsClient/types";
import { subscribeToAggregatedTradeChannel } from "../../../api/Binance/BinanceWsClient";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import OrderTable from "../OrderTable";
import ReactDOM from "react-dom";
import {
  BUY_AND_SELL_ORDER_TABLE,
  BUY_ORDER_TYPE,
  calculateDecimals,
  formatOrdersArray,
  mergeOrderArrays,
  SELL_ORDER_TYPE,
  TABLE_LIMITS,
} from "./utils";
import { getDepth } from "../../../api/Binance/BinanceRestClient";

interface OrderTablesProps {
  symbol: string;
}

const OrderTables: FC<OrderTablesProps> = ({ symbol }) => {
  const [buyAndSellTablesSwitch, setBuyAndSellTablesSwitch] = useState<string>(
    BUY_AND_SELL_ORDER_TABLE
  );
  const [tableLimit, _setTableLimit] = useState<number>(TABLE_LIMITS[0].amount);
  const [decimals, _setDecimals] = useState<number>(0);
  const [buyTableData, _setBuyTableData] = useState<[string, string][]>([]);
  const [sellTableData, _setSellTableData] = useState<[string, string][]>([]);
  const [decimalsArray, setDecimalsArray] = useState<
    { amount: number; displayText: string }[]
  >([]);

  const sellTableDataRef = useRef(sellTableData);
  const buyTableDataRef = useRef(buyTableData);
  const tableLimitRef = useRef(tableLimit);
  const decimalsRef = useRef(decimals);

  const setSellTableData = (data: [string, string][]) => {
    sellTableDataRef.current = data;
    _setSellTableData(data);
  };

  const setBuyTableData = (data: [string, string][]) => {
    buyTableDataRef.current = data;
    _setBuyTableData(data);
  };

  const setTableLimit = (data: number) => {
    tableLimitRef.current = data;
    _setTableLimit(data);
  };

  const setDecimals = (data: number) => {
    decimalsRef.current = data;
    _setDecimals(data);
  };

  const sortBuyAndSellOrders = ({ a, b }: Order) => {
    const mergeSell = mergeOrderArrays(
      sellTableDataRef.current,
      formatOrdersArray(a, decimalsRef.current),
      SELL_ORDER_TYPE,
      tableLimitRef.current
    );
    const mergeBuy = mergeOrderArrays(
      buyTableDataRef.current,
      formatOrdersArray(b,  decimalsRef.current),
      BUY_ORDER_TYPE,
      tableLimitRef.current
    );
    updateBuyAndSellOrders(mergeBuy, mergeSell);
  };

  const updateBuyAndSellOrders: (
    buyOrders: [string, string][],
    sellOrders: [string, string][]
  ) => void = (buyOrders, sellOrders) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setBuyTableData(buyOrders);
      setSellTableData(sellOrders);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialData = await getDepth(symbol, 1000);

        console.log(initialData)

        const decimalsArray = calculateDecimals(initialData.asks[0][0]);

        ReactDOM.unstable_batchedUpdates(() => {
          setDecimalsArray(decimalsArray);
          setDecimals(decimalsArray[2].amount);
        });
        const initialBuyOrders = formatOrdersArray(
          initialData.bids,
          decimalsArray[2].amount
        );
        const initialSellOrders = formatOrdersArray(
          initialData.asks,
          decimalsArray[2].amount
        );
        await updateBuyAndSellOrders(initialBuyOrders, initialSellOrders);

        const ws = await subscribeToAggregatedTradeChannel(
          symbol.toLowerCase()
        );
        let messageCount = 0;
        ws.onmessage = (event: MessageEvent) => {
          const json: OrderStreamResponse = JSON.parse(event.data);
          try {
            if (json.data) {
              console.log(json.data);
              sortBuyAndSellOrders(json.data);
              messageCount++;
            }
            // if(messageCount > 10){
            //   ws.close()
            //   console.log("closed")
            // }
          } catch (err) {
            console.log(err);
            // whatever you wish  to do with the err
          }
        };
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();
  }, []);

  const buyTable = () => {
    return <OrderTable type={BUY_ORDER_TYPE} data={buyTableData} />;
  };

  const sellTable = () => {
    return <OrderTable type={SELL_ORDER_TYPE} data={sellTableData} />;
  };

  const buyAndSellTable = () => {
    return (
      <Grid container>
        <Grid item xs={5}>
          <OrderTable type={BUY_ORDER_TYPE} data={buyTableData} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <OrderTable type={SELL_ORDER_TYPE} data={sellTableData} />
        </Grid>
      </Grid>
    );
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setBuyAndSellTablesSwitch(value);
  };

  const handleDepthChange = (event: SelectChangeEvent<number>) => {
    setTableLimit(+event.target.value);
  };

  const handleDecimalsChange = (event: SelectChangeEvent<number>) => {
    const decimals: number = +event.target.value
    setDecimals(decimals);
    const buyData = formatOrdersArray(buyTableDataRef.current, decimals)
    const sellData = formatOrdersArray(sellTableDataRef.current, decimals)
    console.log(buyData, sellData)
    updateBuyAndSellOrders(buyData, sellData)
  };

  console.log("DECIMALS", decimals);
  console.log("DECIMALS ARRAY", decimalsArray);

  return (
    <>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">
          Order Book
        </FormLabel>

        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={buyAndSellTablesSwitch}
          onChange={handleChange}
        >
          <FormControlLabel
            value={BUY_ORDER_TYPE}
            control={<Radio />}
            label="Buy"
          />
          <FormControlLabel
            value={SELL_ORDER_TYPE}
            control={<Radio />}
            label="Sell"
          />
          <FormControlLabel
            value={BUY_AND_SELL_ORDER_TABLE}
            control={<Radio />}
            label="Buy and Sell"
          />
        </RadioGroup>
      </FormControl>
      <FormControl>
        <InputLabel id="table-limit-label">Table limit</InputLabel>
        <Select
          labelId="table-limit-label"
          id="table-limit-select"
          value={tableLimit}
          label="Table limit"
          onChange={handleDepthChange}
        >
          {TABLE_LIMITS.map((tableLimit) => {
            return (
              <MenuItem key={tableLimit.amount} value={tableLimit.amount}>
                {tableLimit.displayText}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      {decimals ? (
        <FormControl>
          <InputLabel id="decimals-label">Decimals</InputLabel>
          <Select
            labelId="decimals-label"
            id="decimals-select"
            value={decimals}
            label="Table limit"
            onChange={handleDecimalsChange}
          >
            {decimalsArray.length
              ? decimalsArray.map((decimal) => {
                  return (
                    <MenuItem key={decimal.amount} value={decimal.amount}>
                      {decimal.displayText}
                    </MenuItem>
                  );
                })
              : null}
          </Select>
        </FormControl>
      ) : null}

      {buyAndSellTablesSwitch === BUY_ORDER_TYPE ? buyTable() : null}
      {buyAndSellTablesSwitch === SELL_ORDER_TYPE ? sellTable() : null}
      {buyAndSellTablesSwitch === BUY_AND_SELL_ORDER_TABLE
        ? buyAndSellTable()
        : null}
    </>
  );
};

export default OrderTables;
