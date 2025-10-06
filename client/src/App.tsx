import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import ProductsPage from "./pages/products";
import CustomersPage from "./pages/customers";
import OrdersPage from "./pages/orders";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<CustomersPage />} path="/customers" />
      <Route element={<OrdersPage />} path="/orders" />
      <Route element={<ProductsPage />} path="/products" />
    </Routes>
  );
}

export default App;
