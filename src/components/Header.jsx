import { useState, useRef, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { useLocation, useNavigate } from "react-router-dom";
import Avatar from "../assets/images/avatar.png";

const pageTitles = {
  "/": "Dashboard",
  "/products-management": "Products Management",
  "/users-management": "Users Management",
  "/fulfilments-centre-management": "Fulfilments Centre Management",
};

const Header = ({ setIsOpen, setIsLoggedIn }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


  const rawUser = sessionStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;

  const userRole = user?.roles?.includes("admin") ? "Admin" : "";


  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setDropdownOpen(false);
    setIsLoggedIn(false);
    navigate("/login")
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header_container bg-white shadow top-0 h-16 fixed z-10 w-full">
      <div className="header_main flex items-center justify-between mx-2 xl:mx-4 py-4">
        <div className="header_menu flex items-center gap-2">
        <div className="menu_box">
            <RxHamburgerMenu className="open_menu cursor-pointer text-xl md:text-2xl" onClick={() => setIsOpen(true)} />
         </div>
          <h3 className="font-semibold text-sm md:text-lg text-black-1 font-dm-sans leading-5">
            {title}
          </h3>
        </div>

        <div className="right_side flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setDropdownOpen(!dropdownOpen)}>
        
              <div className="w-8 h-8">
                <img src={Avatar} alt="user avatar" className="w-full h-full object-cover rounded-full" />
              </div>

              <div className="hidden semi-md:block">
                <p className="font-dm-sans text-sm text-black-1 font-medium">{userRole}</p>
              </div>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white rounded shadow border z-50">
                <button onClick={handleLogout}
                  className="block w-full cursor-pointer text-left px-4 py-2 hover:text-red-1 transition delay-75 text-sm text-black-4 font-semibold"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;