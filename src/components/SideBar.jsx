import { NavLink, Link } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import { sidebarLinks } from '../Data';
import Logo from "../assets/images/logo.png"

const SideBar = ({isOpen, setIsOpen}) => {

  return (
    <>
      <nav className={`nav_container top-0 pt-7 pb-3 h-screen border-r border-gray-2 bg-white transform transition-transform duration-300 z-15 ${isOpen ? "active" : ""}`}>
        <aside className="aside_wrapper">
          <div className="close_box pr-3">
            <MdOutlineClose className="close_menu cursor-pointer text-2xl" onClick={() => setIsOpen(false)} />
          </div>

          <Link to="/" className="flex items-center justify-center">
            <img src={Logo} alt="yodu logo" />
          </Link>

          <div className="title_menu mt-5 ml-7">
            <p className="font-medium text-black-1 text-sm font-dm-sans">Menu</p>
          </div>

          <ul className="nav-links mt-4 flex flex-col ml-7">
            {sidebarLinks.map((link) => (
              <li key={link.id} className="list-none h-11">
                <NavLink to={link.path} onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 font-normal text-base transition delay-100 duration-200 ease-in-out ${
                      isActive ? "text-red-1 font-bold" : "text-gray-1"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`group-hover:text-red-1 text-gray-1 font-extrabold ${isActive ? "text-red-1 font-bold" : "text-gray-1"}`}>
                        {link.icon}
                      </span>
                      <p className={`group-hover:text-red-1 font-dm-sans text-gray-1 ${isActive ? "text-red-1" : "text-gray-1"}`}>
                        {link.name}
                      </p>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
      </nav>
    </>
  );
};

export default SideBar;