import { Dispatch, FC, SetStateAction } from "react";
import { Grid } from "@mui/material";
import TableLayoutSelector from "./TableLayoutSelector";
import TableLimitSelector from "./TableLimitSelector";
import TableDecimalsSelector from "./TableDecimalsSelector";
import { ITradingPair } from "../../TradingPairSelector";

interface IOrderTableHeader {
  buyAndSellTablesSwitch: string;
  setBuyAndSellTablesSwitch: Dispatch<SetStateAction<string>>;
  tableLimit: number;
  setTableLimit: Dispatch<SetStateAction<number>>;
  decimals: number | undefined;
  setDecimals: Dispatch<SetStateAction<number | undefined>>;
  tradingPair: ITradingPair;
}

/**
 * Composite component for different manipulations that are available for the order tables
 *
 * @param buyAndSellTablesSwitch
 * @param setBuyAndSellTablesSwitch
 * @param tableLimit
 * @param setTableLimit
 * @param decimals
 * @param setDecimals
 * @param tradingPair
 */
const OrderTableHeader: FC<IOrderTableHeader> = ({
  buyAndSellTablesSwitch,
  setBuyAndSellTablesSwitch,
  tableLimit,
  setTableLimit,
  decimals,
  setDecimals,
  tradingPair,
}) => {
  return (
    <>
      <Grid item xs={12} md={6} textAlign={{ xs: "center", md: "left" }}>
        <TableLayoutSelector
          buyAndSellTablesSwitch={buyAndSellTablesSwitch}
          setBuyAndSellTablesSwitch={setBuyAndSellTablesSwitch}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Grid container justifyContent={"flex-end"}>
          <Grid item xs={6} md={4} textAlign={{ xs: "center", md: "right" }}>
            <TableLimitSelector
              tableLimit={tableLimit}
              setTableLimit={setTableLimit}
            />
          </Grid>
          <Grid item xs={6} md={4} textAlign={"right"}>
            <TableDecimalsSelector
              decimals={decimals}
              setDecimals={setDecimals}
              tradingPair={tradingPair}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default OrderTableHeader;
