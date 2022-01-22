import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import OrderBook from "./components/OrderBook";

interface IAppProps {}

const App: FC<IAppProps> = () => {
  //TODO: MOVE ROUTES TO DIFFERENT FILE
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order-book/:symbol" element={<OrderBook />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
