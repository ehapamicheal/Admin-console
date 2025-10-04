import { useState, useEffect, useRef } from 'react';
import { getProducts } from '../../api/productApi';
import { getOrders, getOrdersById } from '../../api/ordersApi';
import { getCategories } from '../../api/categoryApi';
import { BiSolidShow } from "react-icons/bi";
import OrderDetailsModal from '../../components/ui/OrderDetailsModal';
import Spinner from '../../components/ui/Spinner';
import PaginationButton from '../../components/PaginationButton';
import { IoChevronDownOutline } from "react-icons/io5";



const Orders = () => {
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const [allCategories, setAllCategories] = useState([]);
  const [displayCategories, setDisplayCategories] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

    // close dropdown when clicking outside
    useEffect(() => {
    const handleClickOutside = (e) => {
        if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setFilterDropdownOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fetchedCategories = await getCategories();
                setAllCategories(fetchedCategories);
                const topFiveCategories = fetchedCategories.slice(0, 5);
                setDisplayCategories(topFiveCategories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await getOrders();
                const orderList = response.orders || [];

                const ordersWithCart = await Promise.all(
                    orderList.map(async (order) => {
                        try {
                        const fullOrder = await getOrdersById(order.id);
                        const cartItems = fullOrder.cart?.items || [];

                        const selectedProducts = cartItems.map((item) => ({
                            productName: item.selectedOptions?.productName || "N/A",
                            imageUrl: item.selectedOptions?.imageUrl || "",
                        }));

                        return {
                            ...order,
                            orderByProductId: selectedProducts[0],
                        };
                        } catch (err) {
                        console.error(`Error processing order ${order.id}`, err);
                        return { ...order, orderByProductId: null };
                        }
                    })
                );

                setOrders(ordersWithCart);
            } catch (error) {
                console.error("Error fetching orders", error);
            }
        };

        fetchOrders();
    }, []);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await getProducts({ limit: 5 });
                const products = response?.items || [];
                setTopProducts(products);
            } catch (error) {
                console.error("Error fetching top products:", error);
            }
        };

        fetchTopProducts();
    }, []);

    useEffect(() => {
        const now = new Date();

        const filtered = orders.filter((order) => {
            const orderDate = new Date(order.createdAt);

            if (filterType === "Daily") {
                return orderDate.toDateString() === now.toDateString();
            }
            if (filterType === "Weekly") {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return orderDate >= oneWeekAgo;
            }
            if (filterType === "Monthly") {
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(now.getDate() - 30);
                return orderDate >= thirtyDaysAgo;
            }

            return true;
        });

        setCurrentPage(1);
        setFilteredOrders(filtered);
    }, [filterType, orders]);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        });
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
        }
    };

    const handleViewOrder = async (id) => {
        try {
        setIsLoading(true);
        const orderData = await getOrdersById(id);
        setSelectedOrder(orderData);
        setShowOrderModal(true);
        } catch (error) {
        console.error("Failed to fetch order details:", error);
        } finally {
        setIsLoading(false);
        }
    };


  const exportOrdersToCSV = () => {
        const headers = ["Order ID", "Product", "Amount", "Location", "Date", "Payment Type", "Status"];

        const rows = filteredOrders.map(order => [
            order.id,
            order.orderByProductId?.productName || "No product",
            order.amount.toLocaleString(),
            order.deliveryAddress,
            formatDate(order.createdAt),
            order.paymentMethod,
            order.status.replace("_", " "),
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Orders.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

  return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-7">
                <div className="p-4 bg-white shadow-lg rounded">
                    <h2 className="text-base md:text-lg text-black-1 font-bold mb-4">
                        Category ({allCategories.length})
                    </h2>

                    <div className="space-y-2">
                        {displayCategories.map((category) => (
                            <div key={category.id} className="group p-2 rounded-lg">
                                <h3 className="font-semibold text-black-4 text-base leading-6">{capitalizeFirstLetter(category.name)}</h3>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pt-4 pb-4 px-4 bg-white w-full shadow-lg rounded">
                    <h2 className="text-base md:text-lg text-black-1 font-bold mb-4">Top Products</h2>
                    <div className="space-y-4">
                        {topProducts.map((product) => (
                            <div key={product.id} className="flex items-center justify-between group gap-3 rounded-lg">
                                <div className="flex items-center gap-x-4">
                                    <div className="bg-gray-bg rounded-lg w-10 h-10 overflow-hidden p-1">
                                    <img
                                        className="w-full h-full object-cover transition-all ease-in-out duration-300 group-hover:scale-110"
                                        src={product.images?.[0] || "https://placehold.co/100x100?text=No+Image"}
                                        alt={product.title}
                                    />
                                    </div>
                                    <div>
                                    <p className="font-semibold text-black-4 text-[15px] sm:text-base leading-6">
                                        {product.title}
                                    </p>
                                    </div>
                                </div>
                            <h3 className="text-red-2 text-sm font-semibold leading-5">₦{product.price.toLocaleString()}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/*========== ORDER TABLE SECTION STARTS HERE ==========*/}
            <div className="mt-8 bg-white pt-4 rounded-lg shadow-md w-full">
                <div className="flex flex-col md:flex-row gap-4 md:justify-between px-4 mb-4 md:items-center">
                    <h2 className="text-[16px] text-black-1 md:text-lg font-bold">Orders</h2>
                    
                    {/*========== EXPORT CSV BUTTON AND DROPDOWN ==========*/}
                    <div className="flex items-center gap-x-3">
                        <button 
                            onClick={exportOrdersToCSV} 
                            className="text-red-1 text-sm cursor-pointer w-full  transition delay-75 hover:bg-red-1 hover:text-white border border-red-1 rounded-3xl py-2 px-4"
                        >
                            Export as CSV
                        </button>
                                                
                        <div 
                            className="relative bg-gray-bg border border-gray-2 w-full rounded-xl px-3 py-2" 
                            ref={filterDropdownRef}
                        >
                            <div
                            onClick={() => setFilterDropdownOpen((prev) => !prev)}
                            className="flex items-center justify-between cursor-pointer gap-3 outline-none w-full md:min-w-[120px]"
                            >
                            <span className="text-sm text-black-3 font-normal">
                                {filterType === "Monthly" ? "Last 30 Days" : filterType}
                            </span>
                            <IoChevronDownOutline
                                className={`text-black-3 text-base transition-transform duration-300 ${
                                filterDropdownOpen ? "rotate-180" : "rotate-0"
                                }`}
                            />
                            </div>

                            {filterDropdownOpen && (
                            <div className="absolute right-0 mt-4 w-full bg-white border border-gray-2 rounded shadow-lg z-10 
                                            animate-in slide-in-from-top-2 fade-in duration-200">
                                {[
                                { value: "All", label: "All" },
                                { value: "Daily", label: "Daily" },
                                { value: "Weekly", label: "Weekly" },
                                { value: "Monthly", label: "Last 30 Days" }
                                ].map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => {
                                    setFilterType(option.value);
                                    setFilterDropdownOpen(false);
                                    }}
                                    className="px-3 py-2 cursor-pointer text-center transition-all duration-200 hover:bg-red-50 hover:text-red-1 first:rounded-t last:rounded-b"
                                >
                                    <p className={`text-sm ${
                                    filterType === option.value
                                        ? "font-semibold text-red-1"
                                        : "text-black-3 font-normal"
                                    }`}>
                                    {option.label}
                                    </p>
                                </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*========== ORDER TABLE ==========*/}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-100 ">
                                <th className="text-left pl-4 table_th product_th  whitespace-nowrap">No</th>
                                <th className="table_th product_th text-center whitespace-nowrap">Product</th>
                                <th className="table_th product_th text-center whitespace-nowrap">Amount</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Location</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Date</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Payment Type</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Status</th>
                                <th className="table_th text-center product_th whitespace-nowrap">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {currentOrders.map((order, index) => (
                                <tr key={order.id} className="border-b border-gray-2">
                                <td className="pl-4 py-2 whitespace-nowrap tbody_tr_td">{indexOfFirstOrder + index + 1}</td>
                                <td className="py-2 responsive-td3">
                                    <div className="flex items-center justify-items-start gap-2">
                                        <div className="group overflow-hidden bg-gray-6 rounded-lg w-9 h-9 p-1">
                                            <img
                                            src={order.orderByProductId?.imageUrl || "https://via.placeholder.com/50"}
                                            alt={order.orderByProductId?.productName || "No name"}
                                            className="object-cover transition-all ease-in-out duration-300 group-hover:scale-110 w-full h-full"
                                            />
                                        </div>
                                        <p className="text-grey-1 product_tr_td">{order.orderByProductId?.productName || "No product"}</p>
                                    </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">₦{order.amount.toLocaleString()}</td>

                                <td className="py-2 text-center whitespace-nowrap relative group">
                                    <div className="max-w-[120px] mx-auto">
                                    <p className="truncate tbody_tr_td">{order.deliveryAddress}</p>
                                    <div className="absolute z-30 hidden group-hover:flex bg-white shadow-2xl p-2 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 w-60 break-words">
                                        <p className="whitespace-normal break-words text-black text-xs text-center">{order.deliveryAddress}</p>
                                    </div>
                                    </div>
                                </td>

                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">{formatDate(order.createdAt)}</td>
                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td">{order.paymentMethod}</td>
                                <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">
                                    <span
                                        className={`
                                            ${order.status === 'payment_success' ? 'text-green-2' : ''}
                                            ${order.status === 'payment_initialize' ? 'text-blue-500' : ''}
                                            ${order.status === 'payment_failed' ? 'text-red-2' : ''}
                                            ${order.status === 'shipped' ? 'text-yellow-400' : ''}
                                            ${order.status === 'delivered' ? 'text-green-2' : ''}
                                        `}
                                        >
                                    {order.status.replace('_', ' ')}
                                    </span>
                                </td>
                                <td className="py-2 text-center whitespace-nowrap responsive-td1">
                                    <div className="flex gap-x-2 items-center justify-center">
                                       <BiSolidShow 
                                         onClick={() => handleViewOrder(order.id)} 
                                         className="text-green-2 cursor-pointer hover:text-green-600 text-xl" 
                                       />
                                    </div>
                                </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <PaginationButton
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                /> 
            </div>

            {isLoading && (
                <Spinner title="Loading order details..." />
            )}

            {showOrderModal && !isLoading && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowOrderModal(false)}
                />
            )}
        </>
    );
};

export default Orders;