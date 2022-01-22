import React, {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { ExchangeInfoSymbol } from "../../../api/Binance/BinanceRestClient/types";
import { getExchangeInfo } from "../../../api/Binance/BinanceRestClient";
import { Autocomplete, TextField } from "@mui/material";

interface SymbolSelectorProps {
  symbol: string;
  setSymbol: Dispatch<SetStateAction<string>>;
}

interface AutocompleteItem {
  label: string;
}

const SymbolSelector: FC<SymbolSelectorProps> = ({ symbol, setSymbol }) => {
  const [exchangeInfo, setExchangeInfo] = useState<
    ExchangeInfoSymbol[] | undefined
  >(undefined);
  const [autocompleteDefaultValue] = useState<AutocompleteItem>({
    label: symbol,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExchangeInfo();
        setExchangeInfo(
          response.symbols.sort((current, next) => {
            if (current.symbol < next.symbol) {
              return -1;
            }
            if (current.symbol > next.symbol) {
            }
            return 0;
          })
        );
        console.log(response);
      } catch (e) {
        console.log("error occurred");
      }
    };

    fetchData();
  }, []);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: { label: string } | null
  ) => {
    setSymbol(newValue?.label as string);
  };
  const autocompleteOptions = exchangeInfo
    ? exchangeInfo.map(({ symbol }) => ({ label: symbol }))
    : [];

  return (
    <>
      {autocompleteOptions.length ? (
        <Autocomplete
          disablePortal
          options={autocompleteOptions}
          getOptionLabel={(option) => option.label}
          defaultValue={autocompleteDefaultValue}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Symbol" />}
          onChange={handleChange}
        />
      ) : null}
    </>
  );
};

export default SymbolSelector;
