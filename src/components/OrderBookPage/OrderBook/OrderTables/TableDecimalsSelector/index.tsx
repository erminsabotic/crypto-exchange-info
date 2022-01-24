import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { calculateDecimals } from "../../../../../utils/orderArrays";
import { ITradingPair } from "../../../TradingPairSelector";

interface ITableDecimalsSelectorProps {
  decimals: number | undefined;
  setDecimals: Dispatch<SetStateAction<number | undefined>>;
  tradingPair: ITradingPair;
  handleDecimalsChange: (event: SelectChangeEvent<number>) => void;
}

export interface IDecimalOption {
  amount: number;
  displayText: string;
}

const TableDecimalsSelector: FC<ITableDecimalsSelectorProps> = ({
  decimals,
  setDecimals,
  tradingPair,
  handleDecimalsChange,
}) => {
  const [decimalOptions, setDecimalOptions] = useState<IDecimalOption[]>([]);

  useEffect(() => {
    const decimalsArray = calculateDecimals(tradingPair.tickSize ?? "");
    setDecimalOptions(decimalsArray);
    setDecimals(decimalsArray[2].amount);
  }, [tradingPair]);

  return (
    <FormControl>
      <InputLabel id="decimals-label">Decimals</InputLabel>
      {decimalOptions.length ? (
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
      ) : null}
    </FormControl>
  );
};

export default TableDecimalsSelector;
