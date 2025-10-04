import { useEffect, useState } from "react";
import { getFulfilments, updateFulfilmentStatus } from "../../api/fulfilmentApi";
import { RiEdit2Fill } from "react-icons/ri";
import LocationHistoryModal from "../../components/ui/LocationHistoryModal";
import { toast } from "react-toastify";
import PaginationButton from "../../components/PaginationButton";
import { MdArrowDropDown } from "react-icons/md";
import { fulfilledStatus } from "../../Data";


const FulfilmentsCentreManagement = () => {
  const [fulfilments, setFulfilments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDropdownUp, setOpenDropdownUp] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fulfilementPerPage = 10;
  const indexOfLastOrder = currentPage * fulfilementPerPage;
  const indexOfFirstOrder = indexOfLastOrder - fulfilementPerPage;
  const currentFulfilements = fulfilments.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(fulfilments.length / fulfilementPerPage);

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

  return (
    <div className="mx-2 md:mx-4 mt-10 pt-12 pb-6">
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
              {currentFulfilements.map((fulfilment, index) => (
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

                  {/* Status with inline custom dropdown (status-dropdown wrapper) */}
                  <td className="py-2 text-center whitespace-nowrap tbody_tr_td relative responsive-td3">
                    <div className="status-dropdown inline-block relative">
                      {/* trigger: pass event to compute position */}
                      <div
                        className="flex items-center justify-center gap-1 cursor-pointer"
                        onClick={(e) => toggleDropdown(fulfilment.id, e)}
                      >
                        <span
                          className={`capitalize
                            ${fulfilment.status === "shipped" ? "text-yellow-500" : ""}
                            ${fulfilment.status === "delivered" ? "text-green-2" : ""}
                            ${fulfilment.status === "completed" ? "text-blue-500" : ""}
                            ${fulfilment.status === "returned" ? "text-red-2" : ""}
                            ${fulfilment.status === "cancelled" ? "text-gray-500" : ""}
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

                  {/* Actions */}
                  <td className="flex items-center justify-center py-2 text-center whitespace-nowrap responsive-td1">
                    <div className="flex items-center justify-center gap-1">
                      <RiEdit2Fill
                        className="text-green-2 cursor-pointer"
                        onClick={() => openLocationModal(fulfilment.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationButton
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {locationModalOpen && (
        <LocationHistoryModal orderId={selectedOrderId} onClose={closeLocationModal} />
      )}
    </div>
  );
};

export default FulfilmentsCentreManagement;


