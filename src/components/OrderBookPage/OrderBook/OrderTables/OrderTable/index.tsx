import { FC, useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { SELL_ORDER_TYPE } from "../../../../../utils/constants";
import {
  formatOrdersArray,
  mergeOrderArrays,
} from "../../../../../utils/orderArrays";
import { ITradingPair } from "../../../TradingPairSelector";
import { buyTableRowStyles, sellTableRowStyles } from "./styles";

interface IOrderTableProps {
  data: [string, string][];
  decimals: number;
  limit: number;
  type: string;
  tradingPair: ITradingPair;
}

const OrderTable: FC<IOrderTableProps> = ({
  data,
  decimals,
  limit,
  type,
  tradingPair,
}) => {
  const buyOrSellStyle = () => {
    return type === SELL_ORDER_TYPE ? sellTableRowStyles : buyTableRowStyles;
  };
  const [displayData, setDisplayData] = useState<[string, string][]>([]);
  const [allData, setAllData] = useState<[string, string][]>([]);

  useEffect(() => {
    const formattedAllData = formatOrdersArray(allData, decimals);
    setDisplayData(formattedAllData.slice(0, limit));
  }, [allData, limit]);

  useEffect(() => {
    const formattedData = formatOrdersArray(data);
    const mergedArray = mergeOrderArrays(allData, formattedData, type);
    const formattedMergedArray = formatOrdersArray(mergedArray);
    setAllData(formattedMergedArray.slice(0, 100));
  }, [data]);

  useEffect(() => {
    const formattedAllData = formatOrdersArray(allData, decimals);
    setDisplayData(formattedAllData.slice(0, limit));
  }, [decimals]);

  useEffect(() => {
    return () => {
      setAllData([]);
      setDisplayData([]);
    };
  }, [tradingPair]);

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Nr.</TableCell>
            <TableCell>Price ({tradingPair.quoteAsset})</TableCell>
            <TableCell align="right">
              Amount ({tradingPair.baseAsset})
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {displayData
            ? displayData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    ...buyOrSellStyle(),
                  }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}.
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row[0]}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {row[1]}
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderTable;
