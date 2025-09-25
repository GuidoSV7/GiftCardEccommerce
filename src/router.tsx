import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { TokenExpirationHandler } from "./components/TokenExpirationHandler";
import DashboardView from "./views/admin/DashboardView";
import MetricsView from "./views/admin/MetricsView";

import AppLayout from "./layouts/AppLayout";
import SupportLayout from "./layouts/SupportLayout";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import MemberProtectedRoute from "./components/MemberProtectedRoute";
import SupportProtectedRoute from "./components/SupportProtectedRoute";
import AuthRequiredRoute from "./components/AuthRequiredRoute";
// import CreateProductView from "./views/products/CreateProductView";
import { HomeView } from "./views/HomeView";
import { ProductDetailView } from "./views/ProductDetailView";
import { CategoryProductsView } from "./views/CategoryProductsView";
import RegisterView from "./views/auth/RegisterView";
import LoginView from "./views/auth/LoginView";
import MyAccountView from "./views/member/MyAccountView";
import MyOrdersView from "./views/member/MyOrdersView";
import RechargeView from "./views/RechargeView";
import MyCardsView from "./views/member/MyCardsView";
import MyInvoiceView from "./views/member/MyInvoiceView";
import VemperAffiliatesView from "./views/VemperAffiliatesView";
import MyCouponsView from "./views/member/MyCouponsView";
import CreateProductView from "./views/admin/products/CreateProductView";
import ProductsView from "./views/admin/products/ProductsView";
import EditProductView from "./views/admin/products/EditProductView";
import ProductPricingView from "./views/admin/products/ProductPricingView";
import CategoriesView from "./views/admin/categories/CategoriesView";
import CreateCategoryView from "./views/admin/categories/CreateCategoryView";
import CategoriesMetricsView from "./views/admin/categories/CategoriesMetricsView";
import MembersView from "./views/admin/members/MembersView";
import CreateMemberView from "./views/admin/members/CreateMemberView";
import OffersView from "./views/admin/offers/OffersView";
import ProductOffersView from "./views/admin/offers/ProductOffersView";
import CreateOfferView from "./views/admin/offers/CreateOfferView";
import ActiveOffersView from "./views/admin/offers/ActiveOffersView";
import SupportDashboard from "./views/support/SupportDashboard";
import ChatManagement from "./views/support/ChatManagement";
import ChatDetailView from "./views/support/ChatDetailView";
import ActiveChatsView from "./views/support/ActiveChatsView";
import PendingChatsView from "./views/support/PendingChatsView";
import ClosedChatsView from "./views/support/ClosedChatsView";
import NotFoundView from "./views/NotFoundView";

export default function router() {
  return (
    <BrowserRouter>
      <TokenExpirationHandler>
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<HomeView />} index />
        
        {/* Rutas que requieren autenticación */}
        <Route element={<AuthRequiredRoute />}>
          <Route path="/product/:id" element={<ProductDetailView />} />
          <Route path="/category/:categoryId" element={<CategoryProductsView />} />
        </Route>
        
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
          <Route path="/products/pricing/:id" element={<ProductPricingView />} />
          <Route path="/categories" element={<CategoriesView />} />
          <Route path="/categories/create" element={<CreateCategoryView />} />
          <Route path="/categories/metrics" element={<CategoriesMetricsView />} />
          <Route path="/members" element={<MembersView />} />
          <Route path="/members/create" element={<CreateMemberView />} />
          <Route path="/offers" element={<ProductOffersView />} />
          <Route path="/offers/legacy" element={<OffersView />} />
          <Route path="/offers/create" element={<CreateOfferView />} />
          <Route path="/offers/active" element={<ActiveOffersView />} />
        </Route>

        {/* Support routes - Solo para usuarios con rol 'support' */}
        <Route element={<SupportProtectedRoute><SupportLayout /></SupportProtectedRoute>}>
          <Route path="/support/dashboard" element={<SupportDashboard />} index />
          <Route path="/support/chats" element={<ChatManagement />} />
          <Route path="/support/chats/:id" element={<ChatDetailView />} />
          <Route path="/support/active-chats" element={<ActiveChatsView />} />
          <Route path="/support/pending-chats" element={<PendingChatsView />} />
          <Route path="/support/closed-chats" element={<ClosedChatsView />} />
        </Route>

        {/* Ruta 404 - Debe ir al final */}
        <Route path="*" element={<NotFoundView />} />
        </Routes>
      </TokenExpirationHandler>
    </BrowserRouter>
  )
}
