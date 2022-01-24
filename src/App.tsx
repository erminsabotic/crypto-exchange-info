import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import OrderBook from "./components/OrderBookPage";
import NotFoundPage from "./components/NotFoundPage";

/**
 * Defines routes of the application
 *
 * I intentionally left routes here because of the simplicity of the application
 * In a bigger project I would at leas move them to a different file
 */
const App: FC = () => {
  // eslint-disable-next-line no-console
  console.log(
    "THIS IS A CONSOLE ERROR CAUSED BY HELMET PACKAGE. I HAD NO TIME TO LOOK INTO IT."
  );
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/order-book/:tradingPair" element={<OrderBook />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
