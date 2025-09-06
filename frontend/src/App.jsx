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
import Createexpense from "./components/Expenses/Createexpense";
import Details from "./components/Orders/Details";
import Createorders from "./components/Orders/Createorders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<Createproduct />} />
          <Route path="products/:id" element={<Createproduct />} />

          <Route path="customers" element={<Customers />} />
          <Route path="customers/add" element={<Createcustomer />} />
          <Route path="customers/:id" element={<Createcustomer />} />

          <Route path="expenses" element={<Expenses />} />
          <Route path="expenses/add" element={<Createexpense />} />
          <Route path="expenses/:id" element={<Createexpense />} />

          <Route path="orders" element={<Orders />} />
          <Route path="orders/details/:id" element={<Details />} />
          <Route path="orders/add" element={<Createorders />} />
          <Route path="orders/:id" element={<Createorders />} />

          <Route path="ledger" element={<Ledger />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
