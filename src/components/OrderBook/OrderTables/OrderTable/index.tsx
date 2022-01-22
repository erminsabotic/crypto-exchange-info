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
import { ISymbolItem } from "../../index";
import { SELL_ORDER_TYPE } from "../../../../utils/constants";
import {
  formatOrdersArray,
  mergeOrderArrays,
} from "../../../../utils/orderArrays";

interface IOrderTableProps {
  data: [string, string][];
  decimals: number;
  limit: number;
  type: string;
  symbol: ISymbolItem;
}

const OrderTable: FC<IOrderTableProps> = ({
  data,
  decimals,
  limit,
  type,
  symbol,
}) => {
  const buyOrSellColor: () => string = () => {
    return type === SELL_ORDER_TYPE ? "#ffcccb" : "#90ee90";
  };
  //TODO: CONSIDER ADDING ALL DATA TO HAVE EVERYTHING SET UP WHEN DOING DECIMAL CHANGE
  const [displayData, setDisplayData] = useState<[string, string][]>([]);
  useEffect(() => {
    const formattedData = formatOrdersArray(data, decimals);
    const mergedData = mergeOrderArrays(
      displayData,
      formattedData,
      type,
      limit
    );
    setDisplayData(mergedData);
  }, [data, limit]);

  useEffect(() => {
    const formattedDisplayData = formatOrdersArray(displayData, decimals);
    setDisplayData(formattedDisplayData);
  }, [decimals]);

  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Price ({symbol.quoteAsset})</TableCell>
              <TableCell align="right">Amount ({symbol.baseAsset})</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData
              ? displayData.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      backgroundColor: buyOrSellColor(),
                    }}
                  >
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
    </>
  );
};

export default OrderTable;
