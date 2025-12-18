import { useState, useEffect, useRef } from "react";
import {
  FiSearch,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiLock,
  FiSettings,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

// Redux Thunks
import {
  getUserProfile,
  logoutAsyncUser,
} from "../../redux/asyncThunks/authThunks";

import { GLOBAL_SEARCH_PAGES } from "../../assets/searchData";
import { useIsLoggedIn } from "../../utils/userIsLoggedIn";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const cardRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useIsLoggedIn();

  const { profile } = useSelector((state) => state.auth);

  const fuse = new Fuse(GLOBAL_SEARCH_PAGES, {
    keys: ["title"],
    threshold: 0.3,
  });

  const handleSearch = (value) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const results = fuse.search(value).map((r) => r.item);
    setSearchResults(results);
    setShowSearchDropdown(true);
    setActiveIndex(-1);
  };

  // KEYBOARD NAVIGATION
  const handleKeyNavigation = (e) => {
    if (!showSearchDropdown || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev + 1 >= searchResults.length ? 0 : prev + 1
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev - 1 < 0 ? searchResults.length - 1 : prev - 1
      );
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      navigate(searchResults[activeIndex].path);
      setShowSearchDropdown(false);
      setQuery("");
      setActiveIndex(-1);
    }
  };

  // GLOBAL HOTKEY (CTRL + K)
  useEffect(() => {
    const handleHotkey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, []);

  const handleLogout = async () => {
    setShowProfileMenu(false);

    try {
      const res = await dispatch(logoutAsyncUser()).unwrap();

      toast.success(res?.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error?.message || "Logout failed");
    }
  };

  // ------------------ Close dropdown on outside click ------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchDropdown(false);
      }
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------ Scroll Effect ------------------
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getUserName = () => {
    return profile?.name || profile?.fullName || profile?.username || "User";
  };

  const getUserInitial = () => {
    return getUserName().charAt(0).toUpperCase();
  };

  return (
    <header
      className={`relative rounded-2xl px-2 top-0 z-50 transition-all duration-300
      bg-white/95 backdrop-blur-sm`}
    >
      <div className="">
        <div className="flex items-center justify-between h-16">
          {/* ---------------- SEARCH BAR ---------------- */}
          <div className="flex items-center">
            <div className="relative" ref={searchRef}>
              <div className="relative flex items-center">
                <FiSearch className="absolute left-3 h-4 w-4 text-gray-400" />

                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => query && setShowSearchDropdown(true)}
                  onKeyDown={handleKeyNavigation}
                  placeholder="Quick Search — Press Ctrl + K"
                  className="block w-[300px] pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>

              {/* SEARCH DROPDOWN */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg py-2 border border-gray-100 z-50">
                  {searchResults.map((item, index) => (
                    <Link
                      to={item.path}
                      key={index}
                      className={`block px-4 py-2 text-sm rounded-md transition-all
                      ${
                        activeIndex === index
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                      onClick={() => {
                        setShowSearchDropdown(false);
                        setQuery("");
                        setActiveIndex(-1);
                      }}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}

              {showSearchDropdown &&
                searchResults.length === 0 &&
                query.length > 1 && (
                  <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg py-3 text-center text-sm text-gray-500 border border-gray-100">
                    No matching pages
                  </div>
                )}
            </div>
          </div>

          {/* ---------------- PROFILE MENU ---------------- */}
          <div className="flex items-center space-x-4">
            {isLoggedIn === null ? null : isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {/* Permissions Icon */}
                {profile?.role === "ADMIN" && (
                  <Link
                    to="/permissions"
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Permissions"
                  >
                    <FiLock className="h-5 w-5 text-gray-600" />
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative ml-2" ref={cardRef}>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center cursor-pointer space-x-2 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      {getUserInitial()}
                    </div>
                    <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                      {getUserName()}
                    </span>
                  </button>

                  {isLoggedIn && showProfileMenu && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          <FiUser className="mr-2 h-4 w-4" /> Your Profile
                        </Link>

                        {profile?.role === "ADMIN" && (
                          <Link
                            to="/permissions"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <FiLock className="mr-2 h-4 w-4" /> Permissions
                          </Link>
                        )}

                        <span
                          onClick={handleLogout}
                          className="flex items-center px-4 cursor-pointer py-2 text-sm text-gray-700 hover:bg-gray-100 border-t border-gray-100"
                        >
                          <FiLogOut className="mr-2 h-4 w-4" /> Sign out
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Show Login button when not logged in
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <FiLogIn className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
