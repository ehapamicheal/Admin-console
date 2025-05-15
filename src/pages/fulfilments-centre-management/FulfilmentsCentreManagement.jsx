import { useEffect, useState, useRef } from "react";
import { getFulfilments, updateFulfilmentStatus } from "../../api/fulfilmentApi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React from 'react';
import { RiEdit2Fill } from "react-icons/ri";
import LocationHistoryModal from "../../components/ui/LocationHistoryModal";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { TbStatusChange } from "react-icons/tb";
import PaginationButton from "../../components/PaginationButton";



const FulfilmentsCentreManagement = () => {
  const [fulfilments, setFulfilments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const fulfilementPerPage = 10;
  const indexOfLastOrder = currentPage * fulfilementPerPage;
  const indexOfFirstOrder = indexOfLastOrder - fulfilementPerPage;
  const currentFulfilements = fulfilments.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(fulfilments.length / fulfilementPerPage);

  // Location Modal
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Status modal
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [error, setError] = useState(""); 
  const [isloading, setIsLoading] = useState(false);

 

  useEffect(() => {
    const fetchFulfilments = async () => {
      try{
        const response = await getFulfilments();
        console.log("fetched the page", response);
        setFulfilments(response);
      } catch (error) {
        console.error("fulfilments not fetched", error);
      }
    }

    fetchFulfilments();
  }, [])

  const handlePageChange = (pageNumber) => {
      if (pageNumber > 0 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const openLocationModal = (orderId) => {
    setSelectedOrderId(orderId);
    setLocationModalOpen(true);
  };

  const closeLocationModal = () => {
    setSelectedOrderId(null);
    setLocationModalOpen(false);
  };

  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status); 
    setIsStatusModalOpen(true);
  };

  
  const handleStatusChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      await updateFulfilmentStatus(selectedOrder.id, newStatus);
      setFulfilments((prev) =>
        prev.map((f) =>
          f.id === selectedOrder.id ? { ...f, status: newStatus } : f
        )
      );
      setIsStatusModalOpen(false);
      toast.success("Status updated successfully");
      setError("");
    } catch (error) {
      console.error("Failed to update status:", error);
      setError(error.response?.data?.message || "Status update failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  return (
    <div className="mx-2 md:mx-4 mt-10 pt-12 pb-6">

      <div className="mt-8 bg-white rounded-lg shadow-md w-full">
  
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
              <thead>
                  <tr className="border-b border-gray-2 bg-gray-100 ">
                      <th className="text-left pl-4 table_th product_th  whitespace-nowrap">No</th>
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
                      <td className="pl-4 py-2 whitespace-nowrap tbody_tr_td">{indexOfFirstOrder + index + 1}</td>
                      <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td3">{formatDate(fulfilment.createdAt)}</td>
                      <td className="py-2 text-center whitespace-nowrap relative group">
                        <div className="max-w-[120px] mx-auto">
                            <p className="truncate tbody_tr_td">{fulfilment.deliveryAddress}</p>

                            <div className="absolute z-30 hidden group-hover:flex bg-white shadow-2xl p-2 rounded-lg bottom-full left-1/2 transform -translate-x-1/2 w-60 break-words">
                                <p className="whitespace-normal break-words text-black-1 text-xs text-center">{fulfilment.deliveryAddress}</p>
                            </div>
                        </div>
                      </td>
                      <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td2">₦{fulfilment.amount}</td>
                      <td className="py-2 text-center whitespace-nowrap tbody_tr_td responsive-td3">{fulfilment.paymentMethod}</td>
                      <td className="py-2 text-center whitespace-nowrap tbody_tr_td relative responsive-td3">
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

                      </td>

                      <td className="flex items-center justify-center py-2 text-center whitespace-nowrap responsive-td1">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => openStatusModal(fulfilment)}>
                            <TbStatusChange className="text-xl cursor-pointer text-amber-400" />
                          </button>

                          <RiEdit2Fill className="text-green-2 cursor-pointer"  onClick={() => openLocationModal(fulfilment.id)} />
                        </div>
                       
                      </td> 
                    </tr>
                  ))}
              </tbody>
          </table>


          {isStatusModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsStatusModalOpen(false)}></div>

              <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-black-4">Update Status</h2>
                  <RiCloseLine
                    className="cursor-pointer text-red-2 text-2xl"
                    onClick={() => setIsStatusModalOpen(false)}
                  />
                </div>

                {/* <form onSubmit={(e) => {
                    e.preventDefault();
                    handleStatusChange(selectedOrder.id, newStatus);
                  }}
                > */}
                <form onSubmit={handleStatusChange}>
                  <label htmlFor="status" className="text-base text-black-1 font-semibold mb-1 block">Status</label>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md px-4 py-2 w-full mb-2"
                    placeholder="Enter status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  />

                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                  <div className="flex justify-end space-x-4 mt-4">
                    <button
                      type="button"
                      className="cursor-pointer border w-full text-red-2 rounded-3xl py-2"
                      onClick={() => setIsStatusModalOpen(false)}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isloading}
                      className="cursor-pointer bg-red-1 w-full font-bold text-white p-2 rounded-3xl flex items-center justify-center"
                    >
                      {isloading && (
                        <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                      )}
                      {isloading ? "Saving..." : "Update"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}


        </div>

        <PaginationButton
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        /> 

      </div>

      {locationModalOpen && (
        <LocationHistoryModal
          orderId={selectedOrderId}
          onClose={closeLocationModal}
        />
      )}
    </div>
  )
}

export default FulfilmentsCentreManagement;