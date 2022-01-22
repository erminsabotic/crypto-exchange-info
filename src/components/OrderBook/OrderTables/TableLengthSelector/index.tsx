import { FC } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { TABLE_LIMITS } from "../../../../utils/constants";

interface ITableLengthSelectorProps {
  tableLimit: number;
  handleTableLimitChange: (event: SelectChangeEvent<number>) => void;
}

const TableLengthSelector: FC<ITableLengthSelectorProps> = ({
  tableLimit,
  handleTableLimitChange,
}) => {
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

export default TableLengthSelector;
