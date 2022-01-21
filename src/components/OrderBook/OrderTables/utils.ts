const BUY_ORDER_TYPE: string = "buy";
const SELL_ORDER_TYPE: string = "sell";
const BUY_AND_SELL_ORDER_TABLE: string = "buy-and-sell";
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
  let [i, j, k] = [0, 0, 0];
  const mergedOrderData: [string, string][] = [];

  while (i < currentOrderData.length && j < newOrderData.length) {
    const currentPrice: number = +parseFloat(currentOrderData[i][0]);
    const newPrice: number = +parseFloat(newOrderData[j][0]);

    if (shouldMergeByBuyOrSellType(type, currentPrice, newPrice)) {
      if (
        mergedOrderData.length === 0 ||
        mergedOrderData[k - 1][0] !== currentOrderData[i][0]
      ) {
        mergedOrderData[k] = [currentOrderData[i][0], currentOrderData[i][1]];
        k++;
      }
      i++;
    } else {
      const newAmount: number = +parseFloat(newOrderData[j][1]);
      if (
        newPrice &&
        newAmount &&
        (mergedOrderData.length === 0 ||
          mergedOrderData[k - 1][0] !== newOrderData[j][0])
      ) {
        mergedOrderData[k++] = [newOrderData[j][0], newOrderData[j][1]];
      }
      j++;
    }
  }

  while (i < currentOrderData.length) {
    if (
      mergedOrderData.length === 0 ||
      mergedOrderData[k - 1][0] !== currentOrderData[i][0]
    ) {
      mergedOrderData[k++] = [currentOrderData[i][0], currentOrderData[i][1]];
    }
    i++;
  }

  while (j < newOrderData.length) {
    const newPrice: number = +parseFloat(newOrderData[j][0]);
    const newAmount: number = +parseFloat(newOrderData[j][1]);

    if (
      newPrice &&
      newAmount &&
      (mergedOrderData.length === 0 ||
        mergedOrderData[k - 1][0] !== newOrderData[j][0])
    ) {
      mergedOrderData[k++] = [newOrderData[j][0], newOrderData[j][1]];
    }
    j++;
  }

  return mergedOrderData.slice(0, limit);
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

const calculateDecimals: (
  price: string
) => { amount: number; displayText: string }[] = (price) => {
  const decimalPart = price.split(".")[1];
  console.log("decimalPart", decimalPart);
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
  //TODO move zero check here and refactor merge function
  return orders
    .map((order) => {
      order[0] = parseFloat(order[0]).toFixed(decimals);
      console.log("ORDER", order[0], decimals)
      return order;
    })
    .filter((order, index, array) => {
      return index === 0 || order[0] !== array[index - 1][0];
    });
};

export {
  BUY_ORDER_TYPE,
  SELL_ORDER_TYPE,
  BUY_AND_SELL_ORDER_TABLE,
  TABLE_LIMITS,
  mergeOrderArrays,
  calculateDecimals,
  formatOrdersArray,
};
