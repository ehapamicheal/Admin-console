"use client";

import { motion, AnimatePresence } from "framer-motion";
import { createFulfilmentAgent } from "../../api/usersApi";
import { toast } from "react-toastify";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";

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



const FulfilmentAgentModal = ({isOpen, user, onClose, onSuccess}) => {
    const [loading, setLoading] = useState(false);
    const [assignedState, setAssignedState] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!assignedState) {
            toast.error("Please assign a state");
            return;
        }

        try {
            setLoading(true);
            await createFulfilmentAgent({userId: user.id, assignedState});
            toast.success("Fulfilment agent created successfully");
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error("Fail to create agent")
        } finally {
            setLoading(false);
        }
    }

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
              Add {user.firstName} {user.lastName} has an agent
            </h2>

            <form
              className="flex flex-col relative" onSubmit={handleSubmit}
            >
                <div className="">
                    <label className="text-black-1 font-medium text-base block mb-2" htmlFor="state">Assign State</label>
                    <input 
                    value={assignedState} 
                    onChange={(e) => setAssignedState(e.target.value)}
                    className="w-full border border-gray-2 p-2 text-[15px] text-black-1 rounded outline-none focus:border-red-1" type="text" name="state" id="state" placeholder="State" />
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
                  {loading ? "Creating..." : "Create Agent"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FulfilmentAgentModal;