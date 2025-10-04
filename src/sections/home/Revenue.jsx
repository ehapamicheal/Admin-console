// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// const Revenue = () => {
      
//     const data = [
//         { month: 'Jan', revenue: 4000 },
//         { month: 'Feb', revenue: 3000 },
//         { month: 'Mar', revenue: 5000 },
//         { month: 'Apr', revenue: 4000 },
//         { month: 'May', revenue: 4500 },
//         { month: 'Jun', revenue: 4800 },
//         { month: 'Jul', revenue: 4700 },
//         { month: 'Aug', revenue: 5000 },
//         { month: 'Sep', revenue: 5200 },
//         { month: 'Oct', revenue: 5100 },
//         { month: 'Nov', revenue: 5300 },
//         { month: 'Dec', revenue: 2000 },
//     ];
      

//     return (
//         <section className="mt-7">
//             <div className="py-4 bg-white shadow-lg rounded">
//                 <div className="flex items-center justify-between px-4 mb-4">
//                     <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

//                     <div className="bg-gray-bg rounded p-1">
//                         <select className="outline-none text-sm text-black-3 font-normal leading-2 pl-1" name="" id="">
//                             <option value="Weekly">Weekly</option>
//                             <option value="Monthly">Monthly</option>
//                             <option value="Daily">Daily</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="ml-2 mr-1">
//                     <ResponsiveContainer width="100%" height={300}>
//                         <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//                         <defs>
//                             <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                             <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
//                             <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
//                             </linearGradient>
//                         </defs>
//                         <XAxis dataKey="month" />
//                         <YAxis />
//                         <CartesianGrid  strokeDasharray="0" vertical={false} stroke="#B6B6B6"/>
//                         <Tooltip />
//                         <Area type="monotone" dataKey="revenue" stroke="#FF4D4D" fillOpacity={1} fill="url(#colorRevenue)" />
//                         </AreaChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         </section>
//     )
// }

// export default Revenue;


// import { useEffect, useRef, useState } from "react";
// import { getOrders } from "../../api/ordersApi"; 
// import { IoChevronDownOutline } from "react-icons/io5";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// const Revenue = () => {
//   const [orders, setOrders] = useState([]);
//   const [timeframe, setTimeframe] = useState("Monthly");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch orders
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await getOrders();
//         setOrders(res?.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Calculate revenue based on timeframe
//   const filteredRevenue = () => {
//     const validStatuses = ["completed", "delivered", "shipped"]; // only count these
//     const filteredOrders = orders.filter((o) => validStatuses.includes(o.status));

//     // For simplicity, we’ll fake grouping by month/week/day here.
//     // You can replace this logic later to actually group by createdAt.
//     if (timeframe === "Weekly") {
//       return [
//         { period: "Week 1", revenue: 12000 },
//         { period: "Week 2", revenue: 15500 },
//         { period: "Week 3", revenue: 9800 },
//         { period: "Week 4", revenue: 21000 },
//       ];
//     } else if (timeframe === "Daily") {
//       return [
//         { period: "Mon", revenue: 3000 },
//         { period: "Tue", revenue: 4200 },
//         { period: "Wed", revenue: 2500 },
//         { period: "Thu", revenue: 4800 },
//         { period: "Fri", revenue: 3100 },
//         { period: "Sat", revenue: 2900 },
//         { period: "Sun", revenue: 3200 },
//       ];
//     } else {
//       // Monthly (default)
//       const monthlyData = [
//         { period: "Jan", revenue: 4000 },
//         { period: "Feb", revenue: 3000 },
//         { period: "Mar", revenue: 5000 },
//         { period: "Apr", revenue: 4000 },
//         { period: "May", revenue: 4500 },
//         { period: "Jun", revenue: 4800 },
//         { period: "Jul", revenue: 4700 },
//         { period: "Aug", revenue: 5000 },
//         { period: "Sep", revenue: 5200 },
//         { period: "Oct", revenue: 5100 },
//         { period: "Nov", revenue: 5300 },
//         { period: "Dec", revenue: 2000 },
//       ];
//       return monthlyData;
//     }
//   };

//   const data = filteredRevenue();

//   const handleSelect = (option) => {
//     setTimeframe(option);
//     setDropdownOpen(false);
//   };

//   return (
//     <section className="mt-7">
//       <div className="py-4 bg-white shadow-lg rounded">
//         <div className="flex items-center justify-between px-4 mb-4">
//           <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

//           <div className="relative bg-gray-bg rounded p-1" ref={dropdownRef}>
//             <button
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               className="flex items-center justify-between gap-1 outline-none text-sm text-black-3 font-normal pl-1"
//             >
//               {timeframe}
//               <IoChevronDownOutline
//                 className={`text-black-3 text-base transition-transform duration-300 ${
//                   dropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//               />
//             </button>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-1 w-[100px] bg-white border border-gray-2 rounded shadow-md z-10">
//                 {["Weekly", "Monthly", "Daily"].map((option) => (
//                   <div
//                     key={option}
//                     onClick={() => handleSelect(option)}
//                     className={`px-2 py-1 text-sm cursor-pointer hover:bg-gray-bg ${
//                       timeframe === option ? "font-semibold text-primary" : "text-black-3"
//                     }`}
//                   >
//                     {option}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="ml-2 mr-1">
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="period" />
//               <YAxis />
//               <CartesianGrid strokeDasharray="0" vertical={false} stroke="#B6B6B6" />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#FF4D4D"
//                 fillOpacity={1}
//                 fill="url(#colorRevenue)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Revenue;



// import { useEffect, useRef, useState } from "react";
// import { getOrders } from "../../api/ordersApi";
// import { IoChevronDownOutline } from "react-icons/io5";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";
// import dayjs from "dayjs";
// import isoWeek from "dayjs/plugin/isoWeek";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// dayjs.extend(isoWeek);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);

// const Revenue = () => {
//   const [orders, setOrders] = useState([]);
//   const [timeframe, setTimeframe] = useState("Monthly");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch orders once on mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await getOrders();
//         setOrders(res?.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter and calculate revenue dynamically
//   const filteredRevenue = () => {
//     const validStatuses = ["completed", "delivered", "shipped"];
//     const validOrders = orders.filter((o) =>
//       validStatuses.includes(o.status?.toLowerCase())
//     );

//     if (!validOrders.length) return [];

//     const revenueMap = new Map();

//     validOrders.forEach((order) => {
//       const date = dayjs(order.createdAt);
//       if (!date.isValid()) return;

//       let key = "";
//       if (timeframe === "Daily") {
//         key = date.format("YYYY-MM-DD");
//       } else if (timeframe === "Weekly") {
//         key = `Week ${date.isoWeek()} - ${date.year()}`;
//       } else {
//         key = date.format("MMM YYYY"); // Monthly
//       }

//       const prev = revenueMap.get(key) || 0;
//       revenueMap.set(key, prev + (order.amount || 0));
//     });

//     // Convert map → sorted array by date order
//     const result = Array.from(revenueMap, ([period, revenue]) => ({
//       period,
//       revenue,
//     })).sort((a, b) => {
//       const dA = dayjs(a.period.split(" ")[0]);
//       const dB = dayjs(b.period.split(" ")[0]);
//       return dA - dB;
//     });

//     return result;
//   };

//   const data = filteredRevenue();

//   const handleSelect = (option) => {
//     setTimeframe(option);
//     setDropdownOpen(false);
//   };

//   // Total revenue for summary (optional)
//   const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

//   return (
//     <section className="mt-7">
//       <div className="py-4 bg-white shadow-lg rounded">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 mb-4">
//           <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

//           <div className="relative bg-gray-bg border border-gray-2 rounded-xl px-3 py-2" ref={dropdownRef}>
//             <div
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               className="flex items-center justify-between cursor-pointer gap-3 outline-none"
//             >
//                <span className="text-sm text-black-3 font-normal"> {timeframe}</span>
//               <IoChevronDownOutline
//                 className={`text-black-3 text-base transition-transform duration-300 ${
//                   dropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//               />
//             </div>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-4 w-[100px] bg-white border transition-all duration-300 border-gray-2 rounded shadow-md z-10">
//                 {["Weekly", "Monthly", "Daily"].map((option) => (
//                   <div
//                     key={option}
//                     onClick={() => handleSelect(option)}
//                     className={`px-2 py-2 cursor-pointer text-center transition duration-300 hover:bg-gray-100`}
//                   >
//                    <p className={`text-sm ${
//                       timeframe === option
//                         ? "font-semibold text-red-1/90"
//                         : "text-black-3 font-normal"
//                     }`}>{option}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Total Revenue Display */}
//         <div className="px-4 mb-2">
//           <p className="text-sm text-black-3 font-medium">
//             Total Revenue:{" "}
//             <span className="text-primary font-bold">
//               ₦{totalRevenue.toLocaleString()}
//             </span>
//           </p>
//         </div>

//         {/* Chart */}
//         <div className="ml-2 mr-1">
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart
//               data={data}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="period" />
//               <YAxis />
//               <CartesianGrid strokeDasharray="0" vertical={false} stroke="#B6B6B6" />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#FF4D4D"
//                 fillOpacity={1}
//                 fill="url(#colorRevenue)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Revenue;


// import { useEffect, useRef, useState } from "react";
// import { getOrders } from "../../api/ordersApi";
// import { IoChevronDownOutline } from "react-icons/io5";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import dayjs from "dayjs";
// import isoWeek from "dayjs/plugin/isoWeek";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// dayjs.extend(isoWeek);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);

// const Revenue = () => {
//   const [orders, setOrders] = useState([]);
//   const [timeframe, setTimeframe] = useState("Monthly");
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [showRevenue, setShowRevenue] = useState(false);
//   const dropdownRef = useRef(null);

//   // Fetch orders once on mount
//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await getOrders();
//         setOrders(res?.orders || []);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
//     fetchOrders();
//   }, []);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Filter and calculate revenue dynamically
//   const filteredRevenue = () => {
//     const validStatuses = ["completed", "delivered", "shipped"];
//     const validOrders = orders.filter((o) =>
//       validStatuses.includes(o.status?.toLowerCase())
//     );

//     if (!validOrders.length) return [];

//     const revenueMap = new Map();

//     // Define all months for Monthly view
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//     const currentYear = dayjs().year();

//     // Initialize all periods with 0
//     if (timeframe === "Monthly") {
//       months.forEach(month => {
//         const key = `${month} ${currentYear}`;
//         revenueMap.set(key, 0);
//       });
//     }

//     validOrders.forEach((order) => {
//       const date = dayjs(order.createdAt);
//       if (!date.isValid()) return;

//       let key = "";
//       if (timeframe === "Daily") {
//         key = date.format("MMM DD");
//       } else if (timeframe === "Weekly") {
//         key = `Week ${date.isoWeek()}`;
//       } else {
//         key = date.format("MMM YYYY"); // Monthly
//       }

//       const prev = revenueMap.get(key) || 0;
//       revenueMap.set(key, prev + (order.amount || 0));
//     });

//     // Convert map → array
//     const result = Array.from(revenueMap, ([period, revenue]) => ({
//       period,
//       revenue,
//     }));

//     // Sort by date order
//     if (timeframe === "Monthly") {
//       result.sort((a, b) => {
//         const monthA = months.indexOf(a.period.split(" ")[0]);
//         const monthB = months.indexOf(b.period.split(" ")[0]);
//         return monthA - monthB;
//       });
//     } else if (timeframe === "Weekly") {
//       result.sort((a, b) => {
//         const weekA = parseInt(a.period.split(" ")[1]);
//         const weekB = parseInt(b.period.split(" ")[1]);
//         return weekA - weekB;
//       });
//     } else {
//       result.sort((a, b) => {
//         const dA = dayjs(a.period);
//         const dB = dayjs(b.period);
//         return dA - dB;
//       });
//     }

//     return result;
//   };

//   const data = filteredRevenue();

//   const handleSelect = (option) => {
//     setTimeframe(option);
//     setDropdownOpen(false);
//   };

//   // Total revenue for summary
//   const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

//   return (
//     <section className="mt-7">
//       <div className="py-4 bg-white shadow-lg rounded">
//         {/* Header */}
//         <div className="flex items-center justify-between px-4 mb-4">
//           <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

//           <div className="relative bg-gray-bg border border-gray-2 rounded-xl px-3 py-2" ref={dropdownRef}>
//             <div
//               onClick={() => setDropdownOpen((prev) => !prev)}
//               className="flex items-center justify-between cursor-pointer gap-3 outline-none"
//             >
//               <span className="text-sm text-black-3 font-normal">{timeframe}</span>
//               <IoChevronDownOutline
//                 className={`text-black-3 text-base transition-transform duration-300 ${
//                   dropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//               />
//             </div>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-4 w-[100px] bg-white border transition-all duration-300 border-gray-2 rounded shadow-md z-10">
//                 {["Weekly", "Monthly", "Daily"].map((option) => (
//                   <div
//                     key={option}
//                     onClick={() => handleSelect(option)}
//                     className={`px-2 py-2 cursor-pointer text-center transition duration-300 hover:bg-gray-100`}
//                   >
//                     <p className={`text-sm ${
//                       timeframe === option
//                         ? "font-semibold text-red-1/90"
//                         : "text-black-3 font-normal"
//                     }`}>{option}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Total Revenue Display with Eye Icon */}
//         <div className="px-4 mb-2 flex items-center gap-2">
//           <p className="text-sm text-black-3 font-medium">
//             Total Revenue:{" "}
//             <span className="text-primary font-bold">
//               {showRevenue ? `₦${totalRevenue.toLocaleString()}` : "₦••••••"}
//             </span>
//           </p>
//           <button
//             onClick={() => setShowRevenue(!showRevenue)}
//             className="text-black-3 hover:text-primary transition-colors"
//           >
//             {showRevenue ? (
//               <AiOutlineEyeInvisible className="text-lg" />
//             ) : (
//               <AiOutlineEye className="text-lg" />
//             )}
//           </button>
//         </div>

//         {/* Chart */}
//         <div className="ml-2 mr-1">
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart
//               data={data}
//               margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
//             >
//               <defs>
//                 <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
//                   <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
//                 </linearGradient>
//               </defs>
//               <XAxis dataKey="period" />
//               <YAxis />
//               <CartesianGrid strokeDasharray="0" vertical={false} stroke="#B6B6B6" />
//               <Tooltip />
//               <Area
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#FF4D4D"
//                 fillOpacity={1}
//                 fill="url(#colorRevenue)"
//               />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Revenue;


import { useEffect, useRef, useState } from "react";
import { getOrders } from "../../api/ordersApi";
import { IoChevronDownOutline } from "react-icons/io5";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const Revenue = () => {
  const [orders, setOrders] = useState([]);
  const [timeframe, setTimeframe] = useState("Monthly");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch orders once on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getOrders();
        setOrders(res?.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and calculate revenue dynamically
  const filteredRevenue = () => {
    const validStatuses = ["completed", "delivered", "shipped"];
    const validOrders = orders.filter((o) =>
      validStatuses.includes(o.status?.toLowerCase())
    );

    if (!validOrders.length) return [];

    const revenueMap = new Map();

    // Define all months for Monthly view
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Initialize all periods with 0
    if (timeframe === "Monthly") {
      months.forEach(month => {
        revenueMap.set(month, 0);
      });
    }

    validOrders.forEach((order) => {
      const date = dayjs(order.createdAt);
      if (!date.isValid()) return;

      let key = "";
      if (timeframe === "Daily") {
        key = date.format("MMM DD");
      } else if (timeframe === "Weekly") {
        key = `Week ${date.isoWeek()}`;
      } else {
        key = date.format("MMM"); 
      }

      const prev = revenueMap.get(key) || 0;
      revenueMap.set(key, prev + (order.amount || 0));
    });

    // Convert map → array
    const result = Array.from(revenueMap, ([period, revenue]) => ({
      period,
      revenue,
    }));

    // Sort by date order
    if (timeframe === "Monthly") {
      result.sort((a, b) => {
        const monthA = months.indexOf(a.period.split(" ")[0]);
        const monthB = months.indexOf(b.period.split(" ")[0]);
        return monthA - monthB;
      });
    } else if (timeframe === "Weekly") {
      result.sort((a, b) => {
        const weekA = parseInt(a.period.split(" ")[1]);
        const weekB = parseInt(b.period.split(" ")[1]);
        return weekA - weekB;
      });
    } else {
      result.sort((a, b) => {
        const dA = dayjs(a.period);
        const dB = dayjs(b.period);
        return dA - dB;
      });
    }

    return result;
  };

  const data = filteredRevenue();

  const handleSelect = (option) => {
    setTimeframe(option);
    setDropdownOpen(false);
  };

  // Total revenue for summary
  const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <section className="mt-7">
      <div className="py-4 bg-white shadow-lg rounded">
        {/*========== HEADER ==========*/}
        <div className="flex items-center justify-between px-4 mb-4">
          <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Revenue</h2>

          {/*========== DAILY, WEEKLY, MONTHLY OPTIONS ==========*/}
          <div className="relative bg-gray-bg border border-gray-2 rounded-xl px-3 py-2" ref={dropdownRef}>
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center justify-between cursor-pointer gap-3 outline-none"
            >
              <span className="text-sm text-black-3 font-normal">{timeframe}</span>
              <IoChevronDownOutline
                className={`text-black-3 text-base transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 mt-4 w-[100px] bg-white border transition-all duration-300 border-gray-2 rounded shadow-md z-10">
                {["Weekly", "Monthly", "Daily"].map((option) => (
                  <div
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`px-2 py-2 cursor-pointer text-center transition duration-300 hover:bg-gray-100`}
                  >
                    <p className={`text-sm ${
                      timeframe === option
                        ? "font-semibold text-red-1/90"
                        : "text-black-3 font-normal"
                    }`}>{option}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/*========== REVENUE AMOUNT ==========*/}
        <div className="px-4 mb-4 flex items-center gap-2">
          <p className="text-base text-black-3 font-medium">
            Total Earnings:{" "}
            <span className=" text-base text-black-3 font-semibold">
              {showRevenue ? `₦${totalRevenue.toLocaleString()}` : "₦••••••"}
            </span>
          </p>
          <button
            onClick={() => setShowRevenue(!showRevenue)}
            className="text-black-3  cursor-pointer transition-colors"
          >
            {showRevenue ? (
              <AiOutlineEyeInvisible className="text-xl" />
            ) : (
              <AiOutlineEye className="text-xl" />
            )}
          </button>
        </div>

        {/*========== REVENUE CHART ==========*/}
        <div className="ml-2 mr-1">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="period" />
              <YAxis />
              <CartesianGrid strokeDasharray="0" vertical={false} stroke="#B6B6B6" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#FF4D4D"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Revenue;

