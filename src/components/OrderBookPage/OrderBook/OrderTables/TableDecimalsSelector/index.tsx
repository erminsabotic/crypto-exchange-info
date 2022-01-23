import { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface ITableDecimalsSelectorProps {
  decimals: number;
  decimalOptions: { amount: number; displayText: string }[];
  handleDecimalsChange: (event: SelectChangeEvent<number>) => void;
}

const TableDecimalsSelector: FC<ITableDecimalsSelectorProps> = ({
  decimals,
  decimalOptions,
  handleDecimalsChange,
}) => {
  return (
    <FormControl>
      <InputLabel id="decimals-label">Decimals</InputLabel>
      <Select
        labelId="decimals-label"
        id="decimals-select"
        value={decimals}
        label="Table limit"
        onChange={handleDecimalsChange}
      >
        {decimalOptions.map((decimal) => {
          return (
            <MenuItem key={decimal.amount} value={decimal.amount}>
              {decimal.displayText}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default TableDecimalsSelector;
