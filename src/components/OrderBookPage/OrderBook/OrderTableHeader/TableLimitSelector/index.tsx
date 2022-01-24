import { Dispatch, FC, SetStateAction } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TABLE_LIMITS } from "../../../../../utils/constants";

interface ITableLimitSelectorProps {
  tableLimit: number;
  setTableLimit: Dispatch<SetStateAction<number>>;
}

/**
 * Used to set table limit for the order table
 *
 * @param tableLimit
 * @param setTableLimit
 */
const TableLimitSelector: FC<ITableLimitSelectorProps> = ({
  tableLimit,
  setTableLimit,
}) => {
  const handleTableLimitChange = (event: SelectChangeEvent<number>) => {
    const tableLimit: number = +event.target.value;
    setTableLimit(tableLimit);
  };
  return (
    <FormControl>
      <InputLabel id="table-limit-label">Table limit</InputLabel>
      <Select
        labelId="table-limit-label"
        id="table-limit-select"
        value={tableLimit}
        label="Table limit"
        onChange={handleTableLimitChange}
      >
        {TABLE_LIMITS.map((tableLimit) => {
          return (
            <MenuItem key={tableLimit.amount} value={tableLimit.amount}>
              {tableLimit.displayText}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default TableLimitSelector;
