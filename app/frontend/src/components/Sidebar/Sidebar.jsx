import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebar2Data, sidebar3Data, sidebarData } from "../../assets/data";
import {
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiPlusCircle,
  FiMenu,
} from "react-icons/fi";
import { MdLocalHospital } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  logoutAsyncUser,
} from "../../redux/asyncThunks/authThunks";
import { toast } from "sonner";

const Sidebar = React.memo(() => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const location = useLocation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { profile, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutAsyncUser()).unwrap();

      if (res?.message) {
        localStorage.removeItem("user");
        toast.success(res.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error?.message || "Logout failed");
    }
  };

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActive = useCallback(
    (link) => {
      return location.pathname === link;
    },
    [location]
  );

  const renderMenuItems = (data, prefix) => {
    return data.map((item, index) => {
      const key = `${prefix}-${item.title}-${index}`;
      const hasSubItems = item.subItems && item.subItems.length > 0;
      const isItemActive =
        isActive(item.link) ||
        (hasSubItems &&
          item.subItems.some((subItem) => isActive(subItem.link)));

      return (
        <div key={key} className="mb-1">
          {hasSubItems ? (
            // With subitems - clickable div for toggling
            <div
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                collapsed ? "justify-center" : "justify-between"
              } ${
                isItemActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              onClick={() => toggleExpand(key)}
            >
              <div className="flex items-center flex-1">
                <item.icon
                  className={
                    isItemActive ? "text-blue-600" : "text-gray-500 shrink-0"
                  }
                />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </div>
              {!collapsed && (
                <span className="text-gray-400 text-xs ml-2">
                  {expandedItems[key] ? <FiChevronDown /> : <FiChevronRight />}
                </span>
              )}
            </div>
          ) : (
            // No subitems - entire div is a Link
            <Link
              to={item.link}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                collapsed ? "justify-center" : "justify-between"
              } ${
                isItemActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center flex-1">
                <item.icon
                  className={isItemActive ? "text-blue-600" : "text-gray-500"}
                />
                {!collapsed && (
                  <span className="ml-3 text-sm font-medium">{item.title}</span>
                )}
              </div>
              {!collapsed && (
                <span className="text-gray-400 text-xs ml-2 invisible">
                  <FiChevronRight />
                </span>
              )}
            </Link>
          )}

          {!collapsed && hasSubItems && expandedItems[key] && (
            <div className="ml-8 mt-1 space-y-1 animate-fadeIn">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  to={subItem.link}
                  key={`${key}-sub-${subIndex}`}
                  className={`block p-2 pl-4 rounded-md text-xs ${
                    isActive(subItem.link)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                  } transition-all duration-150`}
                >
                  {subItem.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div
      className={`h-screen rounded-2xl bg-white flex flex-col border-r border-gray-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with Collapse Button */}
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <MdLocalHospital className="text-2xl text-blue-600 mr-2" />
            <h1 className="text-xl font-bold text-blue-800">MediCare</h1>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-600"
        >
          <FiMenu className="text-lg" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {renderMenuItems(sidebarData, "main")}

        {!collapsed && (
          <h1 className="px-2 mt-3 mb-3 text-[18px] font-bold text-blue-950">
            Transaction
          </h1>
        )}
        {renderMenuItems(sidebar2Data, "tran")}

        {!collapsed && (
          <h1 className="px-2 mt-3 mb-3 text-[18px] font-bold text-blue-950">
            Reports
          </h1>
        )}
        {renderMenuItems(sidebar3Data, "report")}
      </div>

      {/* Quick Actions */}
      {!collapsed && (
        <div className="p-3 border-t border-gray-200">
          <button className="w-full flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200">
            <FiPlusCircle className="mr-2" />
            New Patient
          </button>
        </div>
      )}

      {/* User Profile */}
      {user && (
        <div
          className={`p-3 border-t border-gray-200 flex ${
            collapsed ? "justify-center" : "justify-between items-center"
          }`}
        >
          {!collapsed ? (
            <>
              <Link to="/profile" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  DR
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-800">
                    {profile?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {profile?.isAdmin ? "Administrator" : "User"}
                  </div>
                </div>
              </Link>
              <span
                onClick={handleLogout}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
              >
                <FiLogOut />
              </span>
            </>
          ) : (
            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                DR
              </div>
            </Link>
          )}
        </div>
      )}
    </div>
  );
});

export default Sidebar;
