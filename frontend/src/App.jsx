import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/products";
import Customers from "./pages/Customers";
import Expenses from "./pages/Expenses";
import Orders from "./pages/Orders";
import Ledger from "./pages/Ledger";
import { Createproduct } from "./components/Products/createproduct";
import { Createcustomer } from "./components/Customers/createcustomer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<Createproduct />} />
          <Route path="products/add" element={<Createproduct />} />
          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<Createcustomer />} />
          <Route path="customers/:id" element={<Createcustomer />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="orders" element={<Orders />} />
          <Route path="ledger" element={<Ledger />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
