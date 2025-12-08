import { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Fuse from "fuse.js";

import { useDispatch, useSelector } from "react-redux";
import {
  getUserProfile,
  logoutAsyncUser,
} from "../../redux/asyncThunks/authThunks";
import { toast } from "sonner";
import { GLOBAL_SEARCH_PAGES } from "../../assets/searchData";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1); // ⬅️ NEW

  const { profile, user } = useSelector((state) => state.auth);
  const searchInputRef = useRef(null);
  const searchRef = useRef(null);
  const cardRef = useRef(null);

  const dispatch = useDispatch();

  // ------------------ Fuse.js Search Engine ------------------
  const fuse = new Fuse(GLOBAL_SEARCH_PAGES, {
    keys: ["title"],
    threshold: 0.3,
  });

  // ------------------ Search Logic ------------------
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
    setActiveIndex(-1); // reset highlight
  };

  // ------------------ Keyboard Navigation ↑ ↓ Enter ------------------
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

    if (e.key === "Enter") {
      if (activeIndex >= 0) {
        navigate(searchResults[activeIndex].path);
        setShowSearchDropdown(false);
        setQuery("");
        setActiveIndex(-1);
      }
    }
  };

  // ------------------ GLOBAL HOTKEY (CTRL + K) ------------------
  useEffect(() => {
    const handleHotkey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };

    window.addEventListener("keydown", handleHotkey);
    return () => window.removeEventListener("keydown", handleHotkey);
  }, []);

  // ------------------ Fetch User Profile ------------------
  useEffect(() => {
    if (user) dispatch(getUserProfile());
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutAsyncUser()).unwrap();
      if (res?.message) {
        localStorage.removeItem("user");
        toast.success(res.message);
        navigate("/login");
      }
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
                  ref={searchInputRef} // ⬅️ FIXED CTRL+K
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => query && setShowSearchDropdown(true)}
                  onKeyDown={handleKeyNavigation} // ⬅️ KEY NAVIGATION
                  placeholder="Quick Search — Press Ctrl + K"
                  className="block w-[300px] pl-10 pr-3 py-2 border border-gray-200 rounded-xl text-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>

              {/* ---------------- DROPDOWN ---------------- */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full bg-white shadow-lg rounded-lg py-2 border border-gray-100 z-50 isolate">
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

              {/* No Results */}
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
            {user ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center cursor-pointer space-x-2 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {profile?.name?.charAt(0) || "U"}
                  </div>
                  <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                    {profile?.name || "User"}
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
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
