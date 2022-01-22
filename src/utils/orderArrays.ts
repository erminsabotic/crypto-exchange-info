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
    { amount: ++zeroesCount, displayText: `${zeroesCount} decimals` },
    { amount: ++zeroesCount, displayText: `${zeroesCount} decimals` },
    { amount: ++zeroesCount, displayText: `${zeroesCount} decimals` },
  ];
};

const formatOrdersArray: (
  orders: [string, string][],
  decimals: number
) => [string, string][] = (orders, decimals) => {
  const seen: { [key: string]: boolean } = {};
  console.log("DECIMALS", decimals);
  return orders
    .map((order) => {
      order[0] = parseFloat(order[0]).toFixed(decimals);
      return order;
    })
    .filter((order) => {
      let priceExists: boolean = true;

      if (!seen.hasOwnProperty(order[0])) {
        priceExists = false;
        seen[order[0]] = true;
      }

      return !priceExists;
    });
};

export { mergeOrderArrays, calculateDecimals, formatOrdersArray };
