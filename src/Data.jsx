// SIDEBAR LINKS
import { RxDashboard } from "react-icons/rx";
import { CiShop } from "react-icons/ci";
import { HiMiniUser } from "react-icons/hi2";
import { FaClipboardList } from "react-icons/fa6";

// SIDEBAR LINKS
export const sidebarLinks = [
    { id: 1, 
        name: "Dashboard", 
        path: "/",
        icon: <RxDashboard />
    },
    { id: 2, 
        name: "Products Management", 
        path: "/products-management", 
        icon: <CiShop />
    },
    { id: 3, 
        name: "Users Management", 
        path: "/users-management", 
        icon: <HiMiniUser />
    },
    { id: 4, 
        name: "Fulfilments Centre Management", 
        path: "/fulfilments-centre-management",
        icon: <FaClipboardList /> 
    }
];

  