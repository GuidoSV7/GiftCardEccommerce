import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardView from "./views/DashboardView";

import AppLayout from "./layouts/AppLayout";
import CreateProductView from "./views/gifcards/CreateGifcardView";
import { HomeView } from "./views/HomeView";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
                <Route path="/" element={<HomeView />} index />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/login" element={<LoginView />} />
            <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardView />} index />
               <Route path="/products/create" element={<CreateProductView />} /> 
            </Route>
      </Routes>
    </BrowserRouter>
  )
}
