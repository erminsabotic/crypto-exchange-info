import { FC } from "react";
import Layout from "./components/Layout";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import OrderBook from "./components/OrderBook";

interface AppProps {}

const App: FC<AppProps> = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/order-book/:symbol" element={<OrderBook />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default App;
