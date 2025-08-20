import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-20">
        <Sidebar />
        <main className="flex-1 ml-64 p-6">
          <Outlet />
        </main>
      </div>
      
    </div>
  );
}
