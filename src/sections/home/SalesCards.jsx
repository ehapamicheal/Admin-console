import { useEffect, useState } from 'react'
import {AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { IoMdCart } from "react-icons/io";
import { GrDeliver } from "react-icons/gr";
import SalesCard from '../../components/ui/SalesCard';
import { getOrders } from '../../api/ordersApi';
import  archieveIcon from "../../assets/svgs/archive-svg.svg"
import dayjs from 'dayjs';
import { getAllUsers } from '../../api/usersApi';
import { PiUsersThreeFill } from "react-icons/pi";
import { getProducts } from '../../api/productApi';
import { AiFillProduct } from "react-icons/ai";

const SalesCards = () => {
    const [totalOrders, setTotalOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [productsChartData, setProductsChartData] = useState([]);
    const [totalProducts, setTotalProducts] = useState(0);

    const revenue = [
        { name: "Jan", value: 100 },
        { name: "Feb", value: 1000 },
        { name: "Mar", value: 25000},
        { name: "Apr", value: 100},
        { name: "May", value: 8000},
        { name: "Jun", value: 49000 },
        { name: "Jul", value: 1000 }, 
        { name: "Jul", value: 42000 }, 
        { name: "Jul", value: 4000 }, 
        { name: "Jul", value: 30000 }, 
        { name: "Jul", value: 30000 }, 
        { name: "Jul", value: 30000 }, 
    ];

    // Add this useEffect for products
    // useEffect(() => {
    //   const fetchProductsData = async () => {
    //     try {
    //       setLoading(true);
          
    //       // First, fetch the first page to get total count and pages
    //       const firstPage = await getProducts({ page: 1, limit: 100 });
    //       const total = firstPage.total || 0;
    //       const totalPages = Math.ceil(total / 100) || 1;
    //       setTotalProducts(total);
    
    //       // Collect all products starting from page 1
    //       let allProducts = [];
    
    //       // Fetch all pages
    //       if (totalPages > 0) {
    //         const pagePromises = [];
    //         for (let page = 1; page <= totalPages; page++) {
    //           pagePromises.push(getProducts({ page, limit: 100 }));
    //         }
            
    //         // Fetch all pages in parallel
    //         const results = await Promise.all(pagePromises);
    //         results.forEach(res => {
    //           allProducts = allProducts.concat(res.products || []);
    //         });
    //       }
    
    //       // Group by month
    //       const monthlyCounts = {};
    //       allProducts.forEach(product => {
    //         const month = dayjs(product.createdAt).format("MMM");
    //         monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    //       });
    
    //       // Format data for chart
    //       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //       const formattedData = months.map(m => ({
    //         name: m,
    //         value: monthlyCounts[m] || 0
    //       }));
    
    //       setProductsChartData(formattedData);
    //     } catch (err) {
    //       console.error("Failed to fetch products for chart:", err);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };
    
    //   fetchProductsData();
    // }, []);

//     useEffect(() => {
//   const fetchProductsData = async () => {
//     try {
//       setLoading(true);
      
//       // First, fetch the first page to get total count
//       const firstPage = await getProducts({ page: 1, limit: 100 });
//       const total = firstPage.total || 0;
//       const totalPages = Math.ceil(total / 100) || 1;
//       setTotalProducts(total);

//       // Collect all products starting from page 1
//       let allProducts = [];

//       // Fetch all pages
//       if (totalPages > 0) {
//         const pagePromises = [];
//         for (let page = 1; page <= totalPages; page++) {
//           pagePromises.push(getProducts({ page, limit: 100 }));
//         }
        
//         // Fetch all pages in parallel
//         const results = await Promise.all(pagePromises);
//         results.forEach(res => {
//           // The response is an array directly based on your JSON structure
//           if (Array.isArray(res)) {
//             allProducts = allProducts.concat(res);
//           } else if (res.products) {
//             // In case it's wrapped in a products property
//             allProducts = allProducts.concat(res.products);
//           }
//         });
//       }

//       console.log("Total products fetched:", allProducts.length);
//       console.log("First product createdAt:", allProducts[0]?.createdAt);

//       // Group by month
//       const monthlyCounts = {};
//       allProducts.forEach(product => {
//         if (product.createdAt) {
//           const month = dayjs(product.createdAt).format("MMM"); // "May" for your example
//           monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
//         }
//       });

//       console.log("Monthly counts:", monthlyCounts);

//       // Format data for chart (all 12 months)
//       const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
//       const formattedData = months.map(m => ({
//         name: m,
//         value: monthlyCounts[m] || 0
//       }));

//       console.log("Chart data:", formattedData);

//       setProductsChartData(formattedData);
//     } catch (err) {
//       console.error("Failed to fetch products for chart:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProductsData();
// }, []);

useEffect(() => {
  const fetchProductsData = async () => {
    try {
      setLoading(true);
      
      // First, fetch the first page to get total count
      const firstPage = await getProducts({ page: 1, limit: 100 });
      
      const total = firstPage.total || 0;
      const totalPages = Math.ceil(total / 100) || 1;
      setTotalProducts(total);

      // Collect all products starting from page 1
      let allProducts = [];

      // Fetch all pages
      if (totalPages > 0) {
        const pagePromises = [];
        for (let page = 1; page <= totalPages; page++) {
          pagePromises.push(getProducts({ page, limit: 100 }));
        }
        
        // Fetch all pages in parallel
        const results = await Promise.all(pagePromises);
        results.forEach(res => {
          // Access items from the response object (not products!)
          if (res && res.items && Array.isArray(res.items)) {
            allProducts = allProducts.concat(res.items);
          }
        });
      }

      console.log("Total products fetched:", allProducts.length);
      console.log("First product:", allProducts[0]);

      // Group by month
      const monthlyCounts = {};
      allProducts.forEach(product => {
        if (product.createdAt) {
          const month = dayjs(product.createdAt).format("MMM");
          monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        }
      });

      console.log("Monthly counts:", monthlyCounts);

      // Format data for chart
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedData = months.map(m => ({
        name: m,
        value: monthlyCounts[m] || 0
      }));

      setProductsChartData(formattedData);
    } catch (err) {
      console.error("Failed to fetch products for chart:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchProductsData();
}, []);

    //    useEffect(() => {
    //     const fetchUsersData = async () => {
    //       try {
    //         const res = await getAllUsers({ page: 1, limit: 1000 }); // fetch all pages (adjust if needed)
    //         const users = res.users || [];
    //         const total = res.pagination?.total || 0;
    //         setTotalUsers(total);
    
    //         // Group by month (e.g., "Jan", "Feb", etc.)
    //         const monthlyCounts = {};
    
    //         users.forEach(user => {
    //           const month = dayjs(user.createdAt).format("MMM"); // e.g. "Apr"
    //           monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
    //         });
    
    //         // Ensure we have all 12 months even if count is 0
    //         const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    //         const formattedData = months.map(m => ({
    //           name: m,
    //           value: monthlyCounts[m] || 0
    //         }));
    
    //         setChartData(formattedData);
    //       } catch (err) {
    //         console.error("Failed to fetch users for chart:", err);
    //       }
    //     };
    
    //     fetchUsersData();
    //   }, []);

  
    // TOTAL ORDERS
   
   useEffect(() => {
    const fetchUsersData = async () => {
        try {
        setLoading(true);
        
        // First, fetch the first page to get total count and pages
        const firstPage = await getAllUsers({ page: 1, limit: 100 });
        const totalPages = firstPage.pagination?.totalPages || 1;
        const total = firstPage.pagination?.total || 0;
        setTotalUsers(total);

        // Collect all users starting from page 1
        let allUsers = [];

        // Fetch all pages
        if (totalPages > 0) {
            const pagePromises = [];
            for (let page = 1; page <= totalPages; page++) {
            pagePromises.push(getAllUsers({ page, limit: 100 }));
            }
            
            // Fetch all pages in parallel
            const results = await Promise.all(pagePromises);
            results.forEach(res => {
            allUsers = allUsers.concat(res.users || []);
            });
        }

        // Group by month
        const monthlyCounts = {};
        allUsers.forEach(user => {
            const month = dayjs(user.createdAt).format("MMM");
            monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
        });

        // Format data for chart
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedData = months.map(m => ({
            name: m,
            value: monthlyCounts[m] || 0
        }));

        setChartData(formattedData);
        } catch (err) {
        console.error("Failed to fetch users for chart:", err);
        } finally {
        setLoading(false);
        }
    };

    fetchUsersData();
    }, []);
    
   
    useEffect(() => {
        const fetchTotalOrders = async () => {
        try {
            const response = await getOrders();

            setTotalOrders(response?.orders || []);
        } catch (err) {
            console.error('Error fetching total orders', err);
        } finally {
            setLoading(false);
        }
        };

        fetchTotalOrders();
    }, []);


    const monthlyOrderData = Array.from({ length: 12 }, (_, i) => {
        const month = i; 

        const ordersInMonth = totalOrders.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getMonth() === month;
        });

        return {
        name: new Date(0, month).toLocaleString('default', { month: 'short' }),
        value: ordersInMonth.length
        };
    });


    // DELIVERY
    const totalDelivered = totalOrders.filter(order => order.status === "delivered").length;

    const monthlyDeliveredData = Array.from({ length: 12 }, (_, i) => {
        const month = i;

        const deliveriesInMonth = totalOrders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return order.status === "delivered" && orderDate.getMonth() === month;
        });

        return {
            name: new Date(0, month).toLocaleString('default', { month: 'short' }),
            value: deliveriesInMonth.length
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
            <SalesCard className="p-4">
                <div className="flex gap-2">
                    <div className="bg-green-1 hexagon">
                       <AiFillProduct className="text-white text-xl" />
                    </div>

                    <div className="flex flex-col">
                    <p className="text-sm font-normal text-gray-1 font-dm-sans">Products</p>
                        {loading ? (
                                <div className="w-6 h-6 border-2 border-green-1 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <p className="text-[22px] font-bold text-black-1">{totalProducts}</p>
                        )}

                    </div>
                </div>

                <div className="mt-3">
                    {/* <ResponsiveContainer width="100%" height={50}>
                    <AreaChart data={productsChartData}>
                        <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} />
                        <XAxis dataKey="name" hide />
                        <YAxis tickLine={false} axisLine={false} hide />
                        <Tooltip />

                        <defs>
                        <linearGradient id="colorFill1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
                        </linearGradient>
                        </defs>

                        <Area 
                        type="basis" 
                        dataKey="value" 
                        name="Sales"
                        stroke="#22C55E" 
                        fill="url(#colorFill1)"
                        strokeWidth={2}
                        />
                    </AreaChart>
                    </ResponsiveContainer> */}

                    <ResponsiveContainer width="100%" height={50}>
                        <AreaChart data={productsChartData}>
                            <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} />
                            <XAxis dataKey="name" hide />
                            <YAxis tickLine={false} axisLine={false} hide />
                            <Tooltip />

                            <defs>
                            <linearGradient id="colorFill1" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#22C55E" stopOpacity={0.2} />
                            </linearGradient>
                            </defs>

                            <Area 
                            type="basis" 
                            dataKey="value" 
                            name="Products"
                            stroke="#22C55E" 
                            fill="url(#colorFill1)"
                            strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </SalesCard>

            <SalesCard className="p-4">
            <div className="flex gap-2">
                <div className="bg-red-2 hexagon">
                  <PiUsersThreeFill className="text-white text-xl" />
                </div>

                <div className="flex flex-col">
                <p className="text-sm font-normal text-gray-1 font-dm-sans">Total User</p>
                       {loading ? (
                            <div className="w-6 h-6 border-2 border-red-2 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <p className="text-[22px] font-bold text-black-1">{totalUsers}</p>
                        )}

                </div>
            </div>

            <div className="mt-3">
              
                 <ResponsiveContainer width="100%" height={50}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="#F2F4F" />
              <XAxis dataKey="name" hide />
              <YAxis tickLine={false} axisLine={false} hide />
              <Tooltip />

              <defs>
                <linearGradient id="colorFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF5200" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#FF5200" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <Area
                type="basis"
                dataKey="value"
                name="Users"
                stroke="#FF0000"
                fill="url(#colorFill)"
                strokeWidth={2}
              />
            </AreaChart>
                </ResponsiveContainer>
            </div>
            </SalesCard>

            <SalesCard className="p-4">
                <div className="flex gap-2">
                    <div className="hexagon bg-gray-3">
                        <IoMdCart className="fill-white text-xl" />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Orders</p>
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <p className="text-[22px] font-bold text-black-1">{totalOrders.length.toLocaleString()}</p>
                        )}

                    </div>
                </div>

                <div className="mt-3">
                    <ResponsiveContainer width="100%" height={50}>
                    <AreaChart data={monthlyOrderData}>
                        <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="#B6B6B6" />
                        <XAxis dataKey="name" hide />
                        <YAxis tickLine={false} axisLine={false} hide />
                        <Tooltip />

                        <defs>
                        <linearGradient id="colorFill3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#B6B6B6" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#B6B6B6" stopOpacity={0.2} />
                        </linearGradient>
                        </defs>

                        <Area 
                        type="basis" 
                        dataKey="value" 
                        name="Orders"
                        stroke="#B6B6B6" 
                        fill="url(#colorFill3)"
                        strokeWidth={2} 
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
            </SalesCard>

            <SalesCard className="bg-blue-100 p-4"> 
                <div className="flex gap-2">
                    <div className="hexagon bg-blue-1">
                      <GrDeliver className="text-white text-xl" />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-normal text-gray-1 font-dm-sans">Total Deliveries</p>
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <p className="text-[22px] font-bold text-black-1">
                            {totalDelivered.toLocaleString()}
                            </p>
                        )}
                    </div>

                </div>

                <div className="mt-3">
                    <ResponsiveContainer width="100%" height={50}>
                        <AreaChart data={monthlyDeliveredData}>
                            <CartesianGrid strokeDasharray="0" horizontal={false} vertical={false} stroke="B6B6B6" />
                            <XAxis dataKey="name" hide />
                            <YAxis tickLine={false} axisLine={false} hide />
                            <Tooltip />

                            <defs>
                            <linearGradient id="colorFill4" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#007AFF" stopOpacity={0.8} />
                                <stop offset="100%" stopColor="#007AFF" stopOpacity={0.2} />
                            </linearGradient>
                            </defs>

                            <Area 
                            type="basis" 
                            dataKey="value" 
                            name="Deliveries"
                            stroke="#007AFF" 
                            fill="url(#colorFill4)"
                            strokeWidth={2} 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </SalesCard>

        </div>
    )
}

export default SalesCards;