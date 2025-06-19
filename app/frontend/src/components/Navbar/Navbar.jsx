import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiUser,
  FiMenu,
  FiHelpCircle,
  FiLogOut,
  FiSettings,
  FiCalendar,
} from "react-icons/fi";
import { MdLocalHospital, MdGroups, MdForum } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BsChatDots, BsPeople } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { logoutAsyncUser } from "../../redux/asyncThunks/authThunks";
import { toast } from "sonner";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [unreadNotifications, setUnreadNotifications] = useState(5);
  const navigate = useNavigate();

  const dispatch = useDispatch();

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

  const cardRef = useRef(null);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const markMessagesAsRead = () => {
    setUnreadMessages(0);
  };

  const markNotificationsAsRead = () => {
    setUnreadNotifications(0);
  };

  return (
    <header
      className={`rounded-2xl px-2 top-0 z-50 transition-all duration-300
        bg-white/95 backdrop-blur-sm`}
    >
      <div className="">
        <div className="flex items-center justify-between h-16">
          {/* Left section - Logo and Search */}
          <div className="flex items-center">
            <div className=" relative">
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, reports..."
                  className="block w-[300px] pl-10 pr-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Right section - Icons and Profile */}
          <div className="flex items-center space-x-4">
            {/* Profile dropdown */}
            <div className="relative ml-2 ">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center cursor-pointer space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                  DR
                </div>
                <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                  Dr. Smith
                </span>
              </button>

              {showProfileMenu && (
                <div
                  ref={cardRef}
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                >
                  <div className="py-1">
                    <Link
                      to={"/profile"}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="inline mr-2" /> Your Profile
                    </Link>
                    {/* <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiSettings className="inline mr-2" /> Settings
                    </a> */}
                    {/* <a
                      href="#"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiHelpCircle className="inline mr-2" /> Help
                    </a> */}
                    <span
                      onClick={handleLogout}
                      className="block px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                    >
                      <FiLogOut className="inline mr-2" /> Sign out
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
