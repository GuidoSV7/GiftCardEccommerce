import { BrowserRouter, Route, Routes } from "react-router-dom";
import DashboardView from "./views/DashboardView";

import AppLayout from "./layouts/AppLayout";
// import CreateProductView from "./views/products/CreateProductView";
import { HomeView } from "./views/HomeView";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";
import MyAccountView from "./views/MyAccountView";
import MyOrdersView from "./views/MyOrdersView";
import RechargeView from "./views/RechargeView";
import MyCardsView from "./views/MyCardsView";
import MyInvoiceView from "./views/MyInvoiceView";
import VemperAffiliatesView from "./views/VemperAffiliatesView";
import MyCouponsView from "./views/MyCouponsView";
import CreateProductView from "./views/products/CreateProductView";
import ProductsView from "./views/products/ProductsView";

export default function router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} index />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* Member routes - outside AppLayout to avoid sidebar conflicts */}
        <Route path="/member/my-account" element={<MyAccountView />} />
        <Route path="/member/my-orders" element={<MyOrdersView />} />
        <Route path="/member/recharge" element={<RechargeView />} />
        <Route path="/member/my-cards" element={<MyCardsView />} />
        <Route path="/member/my-invoice" element={<MyInvoiceView />} />
        <Route path="/member/vemper-affiliates" element={<VemperAffiliatesView />} />
        <Route path="/member/my-coupons" element={<MyCouponsView />} />
        
        {/* AppLayout routes - for admin/dashboard */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardView />} index />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/products/create" element={<CreateProductView />} /> 
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
