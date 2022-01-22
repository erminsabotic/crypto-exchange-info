const BUY_ORDER_TYPE: string = "buy";
const SELL_ORDER_TYPE: string = "sell";
const TABLE_LIMITS: { amount: number; displayText: string }[] = [
  {
    amount: 15,
    displayText: "Display 15",
  },
  {
    amount: 30,
    displayText: "Display 30",
  },
  {
    amount: 50,
    displayText: "Display 50",
  },
  {
    amount: 100,
    displayText: "Display 100",
  },
];

const mergeOrderArrays: (
  currentOrderData: [string, string][],
  newOrderData: [string, string][],
  type: string,
  limit: number
) => [string, string][] = (currentOrderData, newOrderData, type, limit) => {
  let [currentDataCounter, newDataCounter, mergedDataCounter] = [0, 0, 0];
  const mergedOrderData: [string, string][] = [];

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
        mergedOrderData[mergedDataCounter++] = createOrderDataEntry(
          currentOrderData[currentDataCounter][0],
          currentOrderData[currentDataCounter][1]
        );
      currentDataCounter++;
    } else {
      if (
        shouldAddToMergedArray(
          mergedOrderData,
          mergedDataCounter,
          newOrderData[newDataCounter][0]
        )
      )
        mergedOrderData[mergedDataCounter++] = createOrderDataEntry(
          newOrderData[newDataCounter][0],
          newOrderData[newDataCounter][1]
        );
      newDataCounter++;
    }
  }

  while (currentDataCounter < currentOrderData.length) {
    if (
      shouldAddToMergedArray(
        mergedOrderData,
        mergedDataCounter,
        currentOrderData[currentDataCounter][0]
      )
    )
      mergedOrderData[mergedDataCounter++] = createOrderDataEntry(
        currentOrderData[currentDataCounter][0],
        currentOrderData[currentDataCounter][1]
      );
    currentDataCounter++;
  }

  while (newDataCounter < newOrderData.length) {
    if (
      shouldAddToMergedArray(
        mergedOrderData,
        mergedDataCounter,
        newOrderData[newDataCounter][0]
      )
    )
      mergedOrderData[mergedDataCounter++] = createOrderDataEntry(
        newOrderData[newDataCounter][0],
        newOrderData[newDataCounter][1]
      );
    newDataCounter++;
  }

  return mergedOrderData.slice(0, limit);
};

const createOrderDataEntry: (
  price: string,
  amount: string
) => [string, string] = (price, amount) => {
  return [price, amount];
};

const shouldMergeByBuyOrSellType: (
  type: string,
  currentPrice: number,
  newPriceL: number
) => boolean = (type, currentPrice, newPrice) => {
  if (type === "buy") {
    return currentPrice > newPrice;
  }

  return currentPrice < newPrice;
};

const shouldAddToMergedArray: (
  mergedArray: [string, string][],
  mergedArrayCounter: number,
  newEntryPrice: string
) => boolean = (mergedArray, mergedArrayCounter, newEntryPrice) =>
  mergedArray.length === 0 ||
  mergedArray[mergedArrayCounter - 1][0] !== newEntryPrice;

const calculateDecimals: (
  price: string
) => { amount: number; displayText: string }[] = (price) => {
  const decimalPart = price.split(".")[1];
  let zeroesCount = 0;
  for (let i = 0; i < decimalPart.length; i++) {
    if (decimalPart.charAt(i) !== "0") break;
    zeroesCount++;
  }

  return [
    { amount: zeroesCount + 1, displayText: `${zeroesCount + 1} decimals` },
    { amount: zeroesCount + 2, displayText: `${zeroesCount + 2} decimals` },
    { amount: zeroesCount + 3, displayText: `${zeroesCount + 3} decimals` },
  ];
};

const formatOrdersArray: (
  orders: [string, string][],
  decimals: number
) => [string, string][] = (orders, decimals) => {
  return orders
    .map((order) => {
      order[0] = parseFloat(order[0]).toFixed(decimals);
      return order;
    })
    .filter((order, index, array) => {
      const price: number = +parseFloat(order[0]);
      const amount: number = +parseFloat(order[1]);

      return (
        price && amount && (index === 0 || order[0] !== array[index - 1][0])
      );
    });
};

export {
  BUY_ORDER_TYPE,
  SELL_ORDER_TYPE,
  TABLE_LIMITS,
  mergeOrderArrays,
  calculateDecimals,
  formatOrdersArray,
};
