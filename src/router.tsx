import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import DashboardView from "./views/DashboardView";
import MetricsView from "./views/MetricsView";

import AppLayout from "./layouts/AppLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import MemberProtectedRoute from "./components/MemberProtectedRoute";
// import CreateProductView from "./views/products/CreateProductView";
import { HomeView } from "./views/HomeView";
import { ProductDetailView } from "./views/ProductDetailView";
import { CategoryProductsView } from "./views/CategoryProductsView";
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
import EditProductView from "./views/products/EditProductView";
import CategoriesView from "./views/categories/CategoriesView";
import CreateCategoryView from "./views/categories/CreateCategoryView";
import CategoriesMetricsView from "./views/categories/CategoriesMetricsView";
import MembersView from "./views/members/MembersView";
import CreateMemberView from "./views/members/CreateMemberView";
import OffersView from "./views/offers/OffersView";
import CreateOfferView from "./views/offers/CreateOfferView";
import ActiveOffersView from "./views/offers/ActiveOffersView";
import NotFoundView from "./views/NotFoundView";

export default function router() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomeView />} index />
        <Route path="/product/:id" element={<ProductDetailView />} />
        <Route path="/category/:categoryId" element={<CategoryProductsView />} />
        <Route path="/register" element={<RegisterView />} />
        <Route path="/login" element={<LoginView />} />
        
        {/* Member routes - Solo para usuarios con rol 'member' */}
        <Route element={<MemberProtectedRoute />}>
          <Route path="/member/my-account" element={<MyAccountView />} />
          <Route path="/member/my-orders" element={<MyOrdersView />} />
          <Route path="/member/recharge" element={<RechargeView />} />
          <Route path="/member/my-cards" element={<MyCardsView />} />
          <Route path="/member/my-invoice" element={<MyInvoiceView />} />
          <Route path="/member/vemper-affiliates" element={<VemperAffiliatesView />} />
          <Route path="/member/my-coupons" element={<MyCouponsView />} />
        </Route>
        
        {/* Admin routes - Solo para usuarios con rol 'admin' o 'superadmin' */}
        <Route element={<AdminProtectedRoute><AppLayout /></AdminProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardView />} index />
          <Route path="/metrics" element={<MetricsView />} />
          <Route path="/products" element={<ProductsView />} />
          <Route path="/products/create" element={<CreateProductView />} />
          <Route path="/products/edit/:id" element={<EditProductView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/categories/create" element={<CreateCategoryView />} />
          <Route path="/categories/metrics" element={<CategoriesMetricsView />} />
          <Route path="/members" element={<MembersView />} />
          <Route path="/members/create" element={<CreateMemberView />} />
          <Route path="/offers" element={<OffersView />} />
          <Route path="/offers/create" element={<CreateOfferView />} />
          <Route path="/offers/active" element={<ActiveOffersView />} />
        </Route>

        {/* Ruta 404 - Debe ir al final */}
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </BrowserRouter>
  )
}
