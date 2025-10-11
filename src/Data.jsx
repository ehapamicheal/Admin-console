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
        name: "Product Management", 
        path: "/product-management", 
        icon: <CiShop />
    },
    { id: 3, 
        name: "User Management", 
        path: "/user-management", 
        icon: <HiMiniUser />
    },
    { id: 4, 
        name: "Fulfilment Centre", 
        path: "/fulfilment-centre",
        icon: <FaClipboardList /> 
    }
];

// ROLES
export const roles = ["admin", "sponsor"];

// FULFILMENT STATUS
export const fulfilledStatus = ["shipped", "delivered", "completed", "returned", "cancelled"];

  