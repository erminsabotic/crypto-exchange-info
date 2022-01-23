import React, {
  Dispatch,
  FC,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { getExchangeInfo } from "../../../api/Binance/BinanceRestClient";
import { Autocomplete, TextField } from "@mui/material";
import { SYMBOL_LABEL_SEPARATOR } from "../../../utils/constants";
import { ISymbolItem } from "../index";
import {
  createTradingPairItemFromTradingPairInPath,
  findTradingPairInTradingPairs,
  formatExchangeInfoResponse,
} from "../../../utils/symbols";
import {useNavigate} from "react-router-dom";

export interface ISymbolSelectorProps {
  symbolInPath: string;
  symbol: ISymbolItem | undefined;
  setSymbol: Dispatch<SetStateAction<ISymbolItem | undefined>>;
}

interface IAutocompleteItem {
  label: string;
}
//TODO: ADD BETTER ERROR CASE HANDLING SCENARIOS
//TODO: RENAME SYMBOL TO TRADING PAIR
const SymbolSelector: FC<ISymbolSelectorProps> = ({
  symbolInPath,
  symbol,
  setSymbol,
}) => {
  const [autocompleteDefaultValue, setAutocompleteDefaultValue] = useState<IAutocompleteItem>();
  const [tradingPairs, setTradingPairs] = useState<ISymbolItem[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pair = createTradingPairItemFromTradingPairInPath(symbolInPath);
        const tradingPairs: ISymbolItem[] = formatExchangeInfoResponse(
          await getExchangeInfo()
        );

        if (findTradingPairInTradingPairs(pair, tradingPairs)) {
          setTradingPairs(tradingPairs);
          setSymbol(pair);
          setAutocompleteDefaultValue({ label: pair.label })
        }
      } catch (e) {
        setNavigateTo404(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if(refresh) {
      setRefresh(!refresh);
      navigate(`/order-book/${symbol?.label}`);
    }
  }, [refresh])

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: { label: string } | null
  ) => {
    if (newValue) {
      const option = tradingPairs.find(({ label }) => label === newValue.label);
      if (option) {
        setSymbol(option);
        setRefresh(true);
      }
    }
  };

  if (navigateTo404) {
    navigate(`/not-found`);
  }

  return (
    <>
      {autocompleteDefaultValue && tradingPairs.length ? (
        <Autocomplete
          disablePortal
          options={tradingPairs}
          isOptionEqualToValue={(option, value) => option.label === value.label}
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
