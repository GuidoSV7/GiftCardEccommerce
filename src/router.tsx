import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardView from "./views/DashboardView";

import AppLayout from "./layouts/AppLayout";
// import CreateProductView from "./views/products/CreateProductView";
import { HomeView } from "./views/HomeView";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>

                <Route path="/" element={<HomeView />} index />
            <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardView />} index />
                {/* <Route path="/products/create" element={<CreateProductView />} /> */}
            </Route>
            

      </Routes>
    </BrowserRouter>
  )
}
