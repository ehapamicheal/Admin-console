import { useEffect, useState } from "react";
import { getFulfilments, updateFulfilmentStatus } from "../../api/fulfilmentApi";
import { RiEdit2Fill } from "react-icons/ri";
import LocationHistoryModal from "../../components/ui/LocationHistoryModal";
import FulfilmentOrderModal from "../../components/ui/FulfilmentOrderModal";
import { toast } from "react-toastify";
import PaginationButton from "../../components/PaginationButton";
import { MdArrowDropDown } from "react-icons/md";
import { fulfilledStatus } from "../../Data";
import { BiSolidShow } from "react-icons/bi";
import { BiSearch } from "react-icons/bi";



const FulfilmentTable = () => {
  const [fulfilments, setFulfilments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDropdownUp, setOpenDropdownUp] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
    
  // Modal states for fulfilment details
  const [fulfilmentModalOpen, setFulfilmentModalOpen] = useState(false);
  const [selectedFulfilment, setSelectedFulfilment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  // Filter first
  const filteredFulfilments = fulfilments.filter((f) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase().trim();

    const city = f.deliveryCity?.toLowerCase().trim() || "";
    const state = f.deliveryState?.toLowerCase().trim() || "";

    // Match either city or state (supports partial match like "oyo" or "ibad")
    return city.includes(term) || state.includes(term);
  });


    
  const fulfilementPerPage = 10;

  const indexOfLastOrder = currentPage * fulfilementPerPage;
  const indexOfFirstOrder = indexOfLastOrder - fulfilementPerPage;
  const currentFulfilements = filteredFulfilments.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredFulfilments.length / fulfilementPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


    //   const fulfilementPerPage = 10;
    //   const indexOfLastOrder = currentPage * fulfilementPerPage;
    //   const indexOfFirstOrder = indexOfLastOrder - fulfilementPerPage;
    //   const currentFulfilements = fulfilments.slice(indexOfFirstOrder, indexOfLastOrder);
    //   const totalPages = Math.ceil(fulfilments.length / fulfilementPerPage);
    
    useEffect(() => {
      const fetchFulfilments = async () => {
        try {
          const response = await getFulfilments();
          setFulfilments(response || []);
        } catch (error) {
          console.error("fulfilments not fetched", error);
        }
      };
      fetchFulfilments();
    }, []);
  
    // close dropdown when clicking outside
    useEffect(() => {
      const handleDocClick = (e) => {
        if (!e.target.closest(".status-dropdown")) {
          setOpenDropdownId(null);
          setOpenDropdownUp(false);
        }
      };
      document.addEventListener("click", handleDocClick);
      return () => document.removeEventListener("click", handleDocClick);
    }, []);
  
    const handlePageChange = (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
    
      const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      };
    
      const openLocationModal = (orderId) => {
        setSelectedOrderId(orderId);
        setLocationModalOpen(true);
      };
    
      const closeLocationModal = () => {
        setSelectedOrderId(null);
        setLocationModalOpen(false);
      };
    
      // toggle dropdown and compute whether to open upward or downward
      const toggleDropdown = (id, e) => {
        e.stopPropagation();
    
        if (openDropdownId === id) {
          setOpenDropdownId(null);
          setOpenDropdownUp(false);
          return;
        }
    
        // measure available space
        const triggerRect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const spaceAbove = triggerRect.top;
    
        const itemHeight = 40; 
        const dropdownHeight = Math.min(fulfilledStatus.length * itemHeight + 8, 400);
    
        const openUp = spaceBelow < dropdownHeight && spaceAbove > dropdownHeight;
    
        setOpenDropdownUp(openUp);
        setOpenDropdownId(id);
      };
    
      const handleStatusSelect = async (fulfilmentId, status) => {
        try {
          await updateFulfilmentStatus(fulfilmentId, status);
          setFulfilments((prev) =>
            prev.map((f) => (f.id === fulfilmentId ? { ...f, status } : f))
          );
          toast.success("Status updated");
          setOpenDropdownId(null);
          setOpenDropdownUp(false);
        } catch (error) {
          console.error("Failed to update status:", error);
          toast.error("Status update failed");
        }
      };
    
      // Handle view details
      const handleViewDetails = (fulfilmentId) => {
        const selected = fulfilments.find((f) => f.id === fulfilmentId);
        setSelectedFulfilment(selected);
        setFulfilmentModalOpen(true);
      };
    
      const closeFulfilmentModal = () => {
        setSelectedFulfilment(null);
        setFulfilmentModalOpen(false);
      };



  return (
    <section>

      {/*========== SEARCH BOX INPUT ==========*/}
      <div className="flex items-center gap-2 bg-white shadow p-2 rounded-md w-full md:w-[35%] xl:w-[30%]">
          <BiSearch className="search_icon cursor-pointer text-black-2 text-xl" />
          <input
              className="text-black-1 font-dm-sans placeholder:text-gray-3 text-base px-1 outline-none w-full"
              type="text"
              placeholder="Search by city or state"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>

      {/* FULFILMENT TABLE */}
      <div className="mt-8 bg-white rounded-lg shadow-md w-full">
        <div className="overflow-x-auto overflow-visible relative">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-2 bg-gray-100 ">
                  <th className="text-left pl-4 table_th product_th whitespace-nowrap">No</th>
                  <th className="table_th text-center product_th whitespace-nowrap">Date</th>
                  <th className="table_th text-center product_th whitespace-nowrap">Location</th>
                  <th className="table_th product_th text-center whitespace-nowrap">Amount</th>
                  <th className="table_th text-center product_th whitespace-nowrap">Payment Type</th>
                  <th className="table_th text-center product_th whitespace-nowrap">Status</th>
                  <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentFulfilements.length > 0 ? (
                currentFulfilements.map((fulfilment, index) => (
                  <tr key={fulfilment.id} className="border-b border-gray-2">
                    <td className="pl-4 py-2 whitespace-nowrap tbody_tr_td">
                      {indexOfFirstOrder + index + 1}
                    </td>

                    <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td3">
                      {formatDate(fulfilment.createdAt)}
                    </td>

                    <td className="py-2 text-center whitespace-nowrap relative group">
                      <div className="max-w-[120px] mx-auto">
                        <p className="truncate tbody_tr_td">{fulfilment.deliveryAddress}</p>
                        <div className="absolute z-30 hidden group-hover:flex bg-white shadow-2xl p-2 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 w-60 break-words">
                          <p className="whitespace-normal break-words text-black-1 text-xs text-center">
                            {fulfilment.deliveryAddress}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">
                      ₦{fulfilment.amount}
                    </td>

                    <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td3">
                      {fulfilment.paymentMethod}
                    </td>

                    <td className="py-2 text-center whitespace-nowrap tbody_tr_td relative responsive-td3">
                      <div className="status-dropdown inline-block relative">
                        <div
                          className="flex items-center justify-center gap-1 cursor-pointer"
                          onClick={(e) => toggleDropdown(fulfilment.id, e)}
                        >
                          <span
                            className={`capitalize
                              ${fulfilment.status === "shipped" ? "text-yellow-500" : ""}
                              ${fulfilment.status === "delivered" ? "text-green-2" : ""}
                              ${fulfilment.status === "completed" ? "text-emerald-600" : ""}
                              ${fulfilment.status === "returned" ? "text-red-2" : ""}
                              ${fulfilment.status === "cancelled" ? "text-red-600" : ""}
                            `}
                          >
                            {fulfilment.status.replace("_", " ")}
                          </span>

                          <MdArrowDropDown
                            className={`text-xl transition-transform duration-200 ${
                              openDropdownId === fulfilment.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>

                        {openDropdownId === fulfilment.id && (
                          <ul
                            className={`absolute right-0 w-36 z-10 px-2 py-1 bg-white shadow-lg rounded-md ${
                              openDropdownUp ? "bottom-full mb-2" : "top-full mt-2"
                            }`}
                          >
                            {fulfilledStatus.map((status) => (
                              <li
                                key={status}
                                onClick={() => handleStatusSelect(fulfilment.id, status)}
                                className="px-3 py-2 hover:bg-red-2/80 rounded-lg transition-all duration-300 hover:text-white cursor-pointer capitalize text-sm"
                              >
                                {status}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </td>

                    <td className="flex items-center justify-center py-2 text-center whitespace-nowrap responsive-td1">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          className="cursor-pointer"
                          type="button"
                          onClick={() => handleViewDetails(fulfilment.id)}
                        >
                          <BiSolidShow className="text-gray-600" />
                        </button>
                        <RiEdit2Fill
                          className="text-green-2 cursor-pointer"
                          onClick={() => openLocationModal(fulfilment.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-6 text-center text-gray-500 font-medium">
                    {searchTerm
                      ? `No fulfilment found for "${searchTerm}". Please try another city or state.`
                      : "No fulfilment records available."}
                  </td>
                </tr>
              )}
            </tbody>

          </table>

          <PaginationButton
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Location History Modal */}
      {locationModalOpen && (
        <LocationHistoryModal orderId={selectedOrderId} onClose={closeLocationModal} />
      )}

      {/* Fulfilment Details Modal */}
      {fulfilmentModalOpen && (
        <FulfilmentOrderModal
          isOpen={fulfilmentModalOpen}
          onClose={closeFulfilmentModal}
          fulfilment={selectedFulfilment}
        />
      )}
    </section>
  )
}

export default FulfilmentTable;