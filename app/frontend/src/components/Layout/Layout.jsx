import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";

const Layout = () => {
  return (
    <div className="p-2 max-w-[1600px] mx-auto overflow-auto">
      <div className="flex flex-col lg:flex-row gap-2 relative">
        <div
          className={`fixed left-0 lg:static z-50 h-screen lg:h-auto transition-transform duration-300 ease-in-out 
          `}
        >
          <Sidebar />
        </div>

        {/* Main content */}
        <div className="flex-1 ">
          <Navbar />
          <div className="mt-5 bg-white rounded-2xl p-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
