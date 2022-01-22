import React, {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { IExchangeInfoSymbol } from "../../../api/Binance/BinanceRestClient/types";
import { getExchangeInfo } from "../../../api/Binance/BinanceRestClient";
import { Autocomplete, TextField } from "@mui/material";
import { stringCompareFunctionForDescendingOrder } from "../../../utils/sortCompares";
import {
  SYMBOL_LABEL_SEPARATOR,
  TRADING_SYMBOL_STATUS,
} from "../../../utils/constants";
import { ISymbolItem } from "../index";

interface ISymbolSelectorProps {
  symbol: ISymbolItem;
  setSymbol: Dispatch<SetStateAction<ISymbolItem | undefined>>;
}

interface IAutocompleteItem {
  label: string;
}

const SymbolSelector: FC<ISymbolSelectorProps> = ({ symbol, setSymbol }) => {
  const [exchangeInfo, setExchangeInfo] = useState<
    IExchangeInfoSymbol[] | undefined
  >(undefined);
  const [autocompleteDefaultValue] = useState<IAutocompleteItem>({
    label: `${symbol.baseAsset}${SYMBOL_LABEL_SEPARATOR}${symbol.quoteAsset}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExchangeInfo();
        setExchangeInfo(
          response.symbols
            .filter(({ status }) => status === TRADING_SYMBOL_STATUS)
            .sort((current, next) =>
              stringCompareFunctionForDescendingOrder(
                current.symbol,
                next.symbol
              )
            )
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
    if (newValue) {
      const option = autocompleteOptions.find(
        ({ label }) => label === newValue.label
      );
      if (option) {
        setSymbol({
          label: `${option.baseAsset}${SYMBOL_LABEL_SEPARATOR}${option.quoteAsset}`,
          symbol: option.symbol,
          baseAsset: option.baseAsset,
          quoteAsset: option.quoteAsset,
        });
      }
    }
  };
  const autocompleteOptions = exchangeInfo
    ? exchangeInfo.map(({ baseAsset, quoteAsset, status, symbol }) => ({
        label: `${baseAsset}${SYMBOL_LABEL_SEPARATOR}${quoteAsset}`,
        symbol,
        quoteAsset,
        baseAsset,
        status,
      }))
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
