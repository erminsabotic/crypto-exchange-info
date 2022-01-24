import { IDecimalOption } from "../components/OrderBookPage/OrderBook/OrderTableHeader/TableDecimalsSelector";
import { BUY_ORDER_TYPE } from "./constants";

/**
 * Merges 2 order arrays into single sorted array
 * Uses O(n+m) time algorithm for merging
 *
 * @param type
 * @param currentPrice
 * @param newPrice
 */
const mergeOrderArrays: (
  currentOrderData: [string, string][],
  newOrderData: [string, string][],
  type: string,
  limit?: number
) => [string, string][] = (currentOrderData, newOrderData, type) => {
  let [currentDataCounter, newDataCounter, mergedDataCounter] = [0, 0, 0];
  const mergedOrderData: [string, string][] = [];

  //Merge both arrays until one has no more elements
  while (
    currentDataCounter < currentOrderData.length &&
    newDataCounter < newOrderData.length
  ) {
    const currentPrice: number = +parseFloat(
      currentOrderData[currentDataCounter][0]
    );
    const newPrice: number = +parseFloat(newOrderData[newDataCounter][0]);

    if (shouldMergeByBuyOrSellType(type, currentPrice, newPrice)) {
      if (
        shouldAddToMergedArray(
          mergedOrderData,
          mergedDataCounter,
          currentOrderData[currentDataCounter][0]
        )
      )
        mergedOrderData[mergedDataCounter++] = [
          currentOrderData[currentDataCounter][0],
          currentOrderData[currentDataCounter][1],
        ];
      currentDataCounter++;
    } else {
      if (
        shouldAddToMergedArray(
          mergedOrderData,
          mergedDataCounter,
          newOrderData[newDataCounter][0]
        )
      )
        mergedOrderData[mergedDataCounter++] = [
          newOrderData[newDataCounter][0],
          newOrderData[newDataCounter][1],
        ];
      newDataCounter++;
    }
  }

  //Merge rest of the currentData elements
  while (currentDataCounter < currentOrderData.length) {
    if (
      shouldAddToMergedArray(
        mergedOrderData,
        mergedDataCounter,
        currentOrderData[currentDataCounter][0]
      )
    )
      mergedOrderData[mergedDataCounter++] = [
        currentOrderData[currentDataCounter][0],
        currentOrderData[currentDataCounter][1],
      ];
    currentDataCounter++;
  }

  //Merge rest of the newData elements
  while (newDataCounter < newOrderData.length) {
    if (
      shouldAddToMergedArray(
        mergedOrderData,
        mergedDataCounter,
        newOrderData[newDataCounter][0]
      )
    )
      mergedOrderData[mergedDataCounter++] = [
        newOrderData[newDataCounter][0],
        newOrderData[newDataCounter][1],
      ];
    newDataCounter++;
  }

  return mergedOrderData;
};

/**
 * Decides whether we should merge by buy type or by sell type
 *
 * Buy type must be ordered in decreasing order (highest to lowest)
 * Sell type must be ordered in increasing order (lowest to highest)
 *
 * @param type
 * @param currentPrice
 * @param newPrice
 */
const shouldMergeByBuyOrSellType: (
  type: string,
  currentPrice: number,
  newPriceL: number
) => boolean = (type, currentPrice, newPrice) => {
  if (type === BUY_ORDER_TYPE) {
    return currentPrice > newPrice;
  }

  return currentPrice < newPrice;
};

/**
 * Decides whether item should be added to the merge array
 *
 * @param mergedArray
 * @param mergedArrayCounter
 * @param newEntryPrice
 */
const shouldAddToMergedArray: (
  mergedArray: [string, string][],
  mergedArrayCounter: number,
  newEntryPrice: string
) => boolean = (mergedArray, mergedArrayCounter, newEntryPrice) =>
  mergedArray.length === 0 ||
  mergedArray[mergedArrayCounter - 1][0] !== newEntryPrice;

/**
 * Returns decimals array used to present decimals in the dropdown
 * Uses tick size obtained from api to set proper number for decimals
 * e.g.
 *  tickSize = 0.00100000
 *
 * @param tickSize
 */
const calculateDecimals: (tickSize: string) => IDecimalOption[] = (
  tickSize
) => {
  let decimals = 8;
  const tickSizeDecimalPart = tickSize.split(".")[1];

  for (let i = 0; i < tickSizeDecimalPart.length; i++) {
    if (tickSizeDecimalPart.charAt(i) !== "0") {
      decimals = i + 1;
      break;
    }
  }

  if (decimals < 2) decimals = 2;

  return [
    {
      amount: decimals - 2,
      displayText: `${decimals - 2} decimals`,
    },
    {
      amount: decimals - 1,
      displayText: `${decimals - 1} decimals`,
    },
    { amount: decimals, displayText: `${decimals} decimals` },
  ];
};

/**
 * Used to set proper format of the price (in proper decimals) and removes duplicates after performing decimal change
 *
 * @param orders
 * @param decimals
 */
const formatOrdersArray: (
  orders: [string, string][],
  decimals?: number | undefined
) => [string, string][] = (orders, decimals) => {
  const seen: { [key: string]: boolean } = {};
  return orders
    .map((order) => {
      let price: string = order[0];
      const amount: string = parseFloat(order[1]).toString();
      if (decimals !== undefined) {
        price = parseFloat(price).toFixed(decimals);
      }
      return [price, amount] as [string, string];
    })
    .filter((order) => {
      let priceExists = true;
      const amount = parseFloat(order[1]);
      if (!Object.prototype.hasOwnProperty.call(seen, order[0])) {
        priceExists = false;
        seen[order[0]] = true;
      }

      return amount && !priceExists;
    });
};

export { mergeOrderArrays, calculateDecimals, formatOrdersArray };
