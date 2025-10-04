import { motion, AnimatePresence } from "framer-motion";
import { assignRoles } from "../../api/usersApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { IoChevronDown } from "react-icons/io5";

const modalVariants = {
  hidden: { opacity: 0, y: -40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.9,
    transition: { duration: 0.35, ease: "easeInOut" },
  },
};

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Sponsor", value: "sponsor" },
];
const AssignRoleModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);

  // Reset role when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedRole("");
      setOpenDropdown(false);
    }
  }, [isOpen]);

  const handleAssign = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    try {
      setLoading(true);
      await assignRoles(user.id, [selectedRole]);
      toast.success("Role assigned successfully!");
      onSuccess(); 
      onClose();
    } catch (err) {
      toast.error("Failed to assign role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="bg-white rounded-2xl overflow-hidden w-[90%] md:w-[50%] md:max-w-sm z-50 py-4 px-4"
            variants={modalVariants}
          >
            {/* Close */}
            <div className="flex justify-end mb-4">
              <button onClick={onClose} aria-label="Close modal" className="group cursor-pointer">
                <RxCross2 className="text-red-2 text-xl transition group-hover:rotate-90 duration-500" />
              </button>
            </div>

            <h2 className="text-lg font-semibold text-black-1 mb-6">
              Assign Role to {user.firstName} {user.lastName}
            </h2>

            <form
              className="flex flex-col relative"
              onSubmit={(e) => {
                e.preventDefault();
                handleAssign();
              }}
            >
              {/* Custom Select */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown((prev) => !prev)}
                  className="w-full border px-3 py-2 rounded-md flex items-center justify-between cursor-pointer"
                >
                  <span>
                    {selectedRole
                      ? roles.find((r) => r.value === selectedRole)?.label
                      : "Select role"}
                  </span>

                  <motion.div
                    animate={{ rotate: openDropdown ? 180 : 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <IoChevronDown className="text-gray-600" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openDropdown && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25 }}
                      className="absolute z-10 mt-1 w-full max-h-21 overflow-y-auto bg-white border rounded-md shadow-md"
                    >
                      {roles.map((role) => (
                        <li
                          key={role.value}
                          onClick={() => {
                            setSelectedRole(role.value);
                            setOpenDropdown(false);
                          }}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            selectedRole === role.value
                              ? "bg-gray-200 font-medium"
                              : ""
                          }`}
                        >
                          {role.label}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex mt-9 justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 cursor-pointer border text-base border-red-1 rounded-3xl text-black-1 hover:bg-gray-50 transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 rounded-3xl cursor-pointer bg-red-1 text-white text-base hover:bg-red-600 disabled:opacity-50"
                >
                  {loading ? "Assigning..." : "Assign Role"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AssignRoleModal;





























// const AssignRoleModal = ({ isOpen, onClose, user, onSuccess }) => {
//   const [selectedRole, setSelectedRole] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleAssign = async () => {
//     if (!selectedRole) {
//       toast.error("Please select a role");
//       return;
//     }
//     try {
//       setLoading(true);
//       await assignRoles(user.id, [selectedRole]);
//       toast.success("Role assigned successfully!");
//       onSuccess(); // refetch users
//       onClose();
//     } catch (err) {
//       toast.error("Failed to assign role");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <AnimatePresence>
//       {isOpen && (
//         <>
//             <motion.div
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

//           {/* Modal Content */}
//           <motion.div
//              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-[90%] z-50 max-h-[90vh]"
//             variants={modalVariants}>
//             {/* Close Button */}
//             <div className="flex justify-end p-4">
//               <button
//                 onClick={onClose}
//                 className="hover:bg-primary/20 bg-gray-2 flex items-center justify-center h-8 w-8 rounded-full group cursor-pointer"
//                 aria-label="Close modal"
//               >
//                 <RxCross2 className="text-text-color text-xl group-hover:rotate-180 transition duration-300" />
//               </button>

//                 <h2 className="text-lg font-semibold mb-4">
//                 Assign Role to {user.firstName} {user.lastName}
//                 </h2>
//             </div>

//             {/* <div className="overflow-y-auto pb-6 max-h-[80vh]">
//               <div className="px-6">
              
            
//               </div>
//             </div> */}

//               <form
//   onSubmit={(e) => {
//     e.preventDefault();
//     handleAssign(); // calls your assignRoles
//   }}
// >
//   <select
//     value={selectedRole}
//     onChange={(e) => setSelectedRole(e.target.value)}
//     className="w-full border p-2 rounded-md mb-4"
//   >
//     <option value="">Select role</option>
//     <option value="admin">Admin</option>
//     <option value="sponsor">Sponsor</option>
//     <option value="fulfilment_agent">Fulfilment Agent</option>
//   </select>

//   <div className="flex justify-end gap-3">
//     <button
//       type="button"
//       onClick={onClose}
//       className="px-4 py-2 rounded-md border hover:bg-gray-100"
//     >
//       Cancel
//     </button>
//     <button
//       type="submit"
//       disabled={loading}
//       className="px-4 py-2 rounded-md bg-red-1 text-white hover:bg-red-600 disabled:opacity-50"
//     >
//       {loading ? "Assigning..." : "Assign Role"}
//     </button>
//   </div>
//               </form>

           
//           </motion.div>
//         </motion.div>
        

        
//           <motion.div
//             className="fixed inset-0 bg-black/40 z-40"
//             onClick={onClose}
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           />
//           <motion.div
//             className="relative bg-white z-50 p-4 md:p-6 rounded-3xl overflow-hidden max-w-xl w-[90%] md:w-[60%] max-h-[90vh]"
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.8 }}
//             transition={{ duration: 0.25 }}
//           >
//             <h2 className="text-lg font-semibold mb-4">
//               Assign Role to {user.firstName} {user.lastName}
//             </h2>

//             {/* <select
//               value={selectedRole}
//               onChange={(e) => setSelectedRole(e.target.value)}
//               className="w-full border p-2 rounded-md mb-4"
//             >
//               <option value="">Select role</option>
//               <option value="admin">Admin</option>
//               <option value="sponsor">Sponsor</option>
//               <option value="fulfilment_agent">Fulfilment Agent</option>
//             </select>

//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 rounded-md border hover:bg-gray-100"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAssign}
//                 disabled={loading}
//                 className="px-4 py-2 rounded-md bg-red-1 text-white hover:bg-red-600 disabled:opacity-50"
//               >
//                 {loading ? "Assigning..." : "Assign Role"}
//               </button>
//             </div> */}

//             {/* <form
//   onSubmit={(e) => {
//     e.preventDefault();
//     handleAssign(); // calls your assignRoles
//   }}
// >
//   <select
//     value={selectedRole}
//     onChange={(e) => setSelectedRole(e.target.value)}
//     className="w-full border p-2 rounded-md mb-4"
//   >
//     <option value="">Select role</option>
//     <option value="admin">Admin</option>
//     <option value="sponsor">Sponsor</option>
//     <option value="fulfilment_agent">Fulfilment Agent</option>
//   </select>

//   <div className="flex justify-end gap-3">
//     <button
//       type="button"
//       onClick={onClose}
//       className="px-4 py-2 rounded-md border hover:bg-gray-100"
//     >
//       Cancel
//     </button>
//     <button
//       type="submit"
//       disabled={loading}
//       className="px-4 py-2 rounded-md bg-red-1 text-white hover:bg-red-600 disabled:opacity-50"
//     >
//       {loading ? "Assigning..." : "Assign Role"}
//     </button>
//   </div>
//            </form> */}


            
//           </motion.div>
//         </>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AssignRoleModal;
