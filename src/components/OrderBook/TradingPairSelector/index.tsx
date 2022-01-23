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
import {
  createTradingPairFromTradingPairLabel, findTradingPairInTradingPairs, formatExchangeInfoResponse
} from "../../../utils/tradingPairs";
import { useNavigate } from "react-router-dom";

export interface ITradingPairSelectorProps {
  tradingPairLabel: string;
  tradingPair: ITradingPair | undefined;
  setTradingPair: Dispatch<SetStateAction<ITradingPair | undefined>>;
}

interface IAutocompleteItem {
  label: string;
}

export interface ITradingPair {
  label: string;
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

//TODO: ADD BETTER ERROR CASE HANDLING SCENARIOS
const TradingPair: FC<ITradingPairSelectorProps> = ({
  tradingPairLabel,
  tradingPair,
  setTradingPair,
}) => {
  const [autocompleteDefaultValue, setAutocompleteDefaultValue] =
    useState<IAutocompleteItem>();
  const [tradingPairs, setTradingPairs] = useState<ITradingPair[]>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [navigateTo404, setNavigateTo404] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pair =
          createTradingPairFromTradingPairLabel(tradingPairLabel);
        const tradingPairs: ITradingPair[] = formatExchangeInfoResponse(
          await getExchangeInfo()
        );

        if (findTradingPairInTradingPairs(pair, tradingPairs)) {
          setTradingPairs(tradingPairs);
          setTradingPair(pair);
          setAutocompleteDefaultValue({ label: pair.label });
        }
      } catch (e) {
        setNavigateTo404(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (refresh) {
      setRefresh(!refresh);
      navigate(`/order-book/${tradingPair?.label}`);
    }
  }, [refresh]);

  const handleChange = (
    event: SyntheticEvent<Element, Event>,
    newValue: { label: string } | null
  ) => {
    if (newValue) {
      const option = tradingPairs.find(({ label }) => label === newValue.label);
      if (option) {
        setTradingPair(option);
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

export default TradingPair;
