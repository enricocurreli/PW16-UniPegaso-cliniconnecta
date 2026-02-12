import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navabar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
