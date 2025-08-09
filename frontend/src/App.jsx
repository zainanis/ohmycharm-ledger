import Layout from "./components/Layout";
import { BrowserRouter, Route, Routes } from "react-router";
import Products from "./pages/products";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Products />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
