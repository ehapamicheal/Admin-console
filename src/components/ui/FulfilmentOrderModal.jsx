
import { motion, AnimatePresence } from "framer-motion";
import { RxCross2 } from "react-icons/rx";

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, y: 50, transition: { duration: 0.3 } },
};

const FulfilmentOrderModal = ({ isOpen, onClose, fulfilment }) => {
  if (!isOpen || !fulfilment) return null;

  const {
    createdAt,
    amount,
    cart,
    status,
    paymentMethod,
    deliveryAddress,
    deliveryCity,
    deliveryState,
  } = fulfilment;

  // format date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

    const getStatusColor = (status) => {
        switch (status) {
            case "payment_success":
            case "delivered":
            return "text-green-600";
            case "completed":
            return "text-emerald-600";
            case "payment_initialize":
            return "text-blue-500";
            case "failed":
            case "returned":
            case "cancelled":
            return "text-red-500";
            case "shipped":
            return "text-yellow-600";
            default:
            return "text-black-1";
        }
    };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit">

          {/*========== OVERLAY ==========*/}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

           {/*========== DETAIL CONTENT ==========*/}
          <motion.div
            className="relative z-50 w-[96%] ms:w-[90%] ms:max-w-4xl bg-white rounded-2xl shadow-lg overflow-hidden"
            variants={modalVariants}>
                <div className="flex items-center justify-between gap-2 mb-3 p-4 border-b border-b-gray-5">
                    <h2 className="text-lg md:text-xl font-semibold text-black-1">
                        Fulfilment Details
                    </h2>
                
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="group cursor-pointer">
                        <RxCross2 className="text-red-500 text-xl transition group-hover:rotate-90 duration-500" />
                    </button>
                </div>

                <div className="py-6 px-4 md:px-6 max-h-[80vh] overflow-y-auto">
                    <p className="text-black-1 mb-5 text-base md:text-lg"><strong>Order ID:</strong> <span className="text-gray-4 font-normal">{fulfilment.id}</span></p>

                    {/*========== INFO ==========*/}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-gray-700">
                        <div className="space-y-3">
                            <p className="text-black-1 text-base md:text-lg">
                            <strong>Date:</strong> {formatDate(createdAt)}
                            </p>

                            <p className="text-black-1 text-base md:text-lg">
                            <strong>Payment Method:</strong> {paymentMethod}
                            </p>

                            <p className="text-black-1 text-base md:text-lg">
                                <strong>City:</strong>{" "}
                                {deliveryCity}
                            </p>

                            <p className="col-span-full text-black-1 text-base md:text-lg">
                                <strong>State:</strong>{" "}
                                {deliveryState}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <p className="text-black-1 text-base md:text-lg">
                            <strong>Total Amount:</strong> ₦{amount.toLocaleString()}
                            </p>

                            <p className="text-black-1 text-base md:text-lg">
                            <strong>Items Count:</strong> {cart?.itemCount}
                            </p>

                            <p className="text-black-1 text-base md:text-lg">
                                <strong>Status:</strong>{" "}
                                <span className={`capitalize font-medium ${getStatusColor(status)}`}>
                                {status.replace("_", " ")}
                                </span>
                            </p>
                        </div>
                    </div>

                    <p className="mb-6 text-black-1 text-base md:text-lg">
                        <strong>Delivery Address:</strong>{" "}
                        {deliveryAddress}
                    </p>

                    {/*========== PRODUCTS ==========*/}
                    <div className="flex flex-col md:justify-between md:flex-row gap-3">
                        <h3 className="text-lg font-semibold text-black-1">
                        Ordered Products ({cart?.items?.length || 0})
                        </h3>

                        <div className="grid gap-4">
                            {cart?.items?.map((item) => (
                            <div key={item.id}
                                className="flex items-center gap-4">
                                <div className="w-20 h-20 p-1 overflow-hidden rounded-lg group bg-gray-6">
                                    <img
                                        src={item.selectedOptions?.imageUrl || item.product?.images?.[0]}
                                        alt={item.selectedOptions?.productName}
                                        className="w-full h-full object-cover rounded-lg transition-all ease-in-out duration-300 group-hover:scale-105"
                                    />
                                </div>
                    
                                <div className="flex-1">
                                <p className="font-semibold text-black-1 text-base md:text-lg">
                                    {item.selectedOptions?.productName}
                                </p>
                                <p className="text-sm text-gray-600 font-normal">
                                    Size: {item.selectedOptions?.size}
                                </p>
                                <p className="text-sm text-gray-600 font-normal">
                                    Quantity: {item.quantity}
                                </p>
                                <p className="text-sm font-medium text-black-1">
                                    ₦{item.price.toLocaleString()}
                                </p>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>

                </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FulfilmentOrderModal;









// const FulfilmentOrderModal = ({isOpen, onClose}) => {


//     if (!isOpen) return null;
//   return (
//      <AnimatePresence>
//       {isOpen && (
//         <motion.div
//           className="fixed inset-0 flex items-center justify-center z-50"
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//         >
//           {/* Overlay */}
//           <motion.div
//             className="absolute inset-0 bg-black"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.5 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//             onClick={onClose}
//           />

//             {/* Modal */}
//             <motion.div
//                 className="relative z-50 w-[96%] ms:w-[90%] ms:max-w-3xl md:w-70%] max-h-[90vh] bg-white rounded-2xl shadow-lg overflow-hidden"
//                 variants={modalVariants}>
//                     {/* Close */}
//                     <div className="flex justify-end mb-4">
//                     <button onClick={onClose} aria-label="Close modal" className="group cursor-pointer">
//                         <RxCross2 className="text-red-2 text-xl transition group-hover:rotate-90 duration-500" />
//                     </button>
//                     </div>

//                 <div className="py-6 pr-4 pl-6 max-h-[80vh] overflow-y-auto">
//                     {/* fulfilment orders detals here */}
//                 </div>

            
//             </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   )
// }

// export default FulfilmentOrderModal;