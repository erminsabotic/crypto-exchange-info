import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import OrderBook from "./components/OrderBook";

interface IAppProps {}

const App: FC<IAppProps> = () => {
  //TODO: MOVE ROUTES TO DIFFERENT FILE
    //TODO: ADD 404 PAGE
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order-book/:tradingPair" element={<OrderBook />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
