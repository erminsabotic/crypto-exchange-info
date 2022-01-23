import { ChangeEvent, Dispatch, FC, SetStateAction } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {
  BUY_ORDER_TYPE,
  SELL_ORDER_TYPE,
} from "../../../../../utils/constants";

interface ITableSelectorProps {
  buyAndSellTablesSwitch: string;
  setBuyAndSellTablesSwitch: Dispatch<SetStateAction<string>>;
}

const TableLayoutSelector: FC<ITableSelectorProps> = ({
  buyAndSellTablesSwitch,
  setBuyAndSellTablesSwitch,
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setBuyAndSellTablesSwitch(value);
  };

  return (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">
        Switch between tables
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
        <FormControlLabel value={""} control={<Radio />} label="Buy and Sell" />
      </RadioGroup>
    </FormControl>
  );
};

export default TableLayoutSelector;
