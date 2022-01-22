import { FC } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

interface OrderTableProps {
  data: [string, string][] | undefined;
  type: string;
}

const OrderTable: FC<OrderTableProps> = ({ data, type }) => {
  const buyOrSellColor: () => string = () => {
    return type === "sell" ? "#ffcccb" : "#90ee90";
  };
  return (
    <>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Price (USDT)</TableCell>
              <TableCell align="right">Amount (BTC)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.map((row, index) => (
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
