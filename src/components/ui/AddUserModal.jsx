import { useState, useRef, useEffect } from "react";
import { RiCloseLine } from "react-icons/ri";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { IoChevronDown } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { createUser } from "../../api/usersApi";
import { roles } from "../../Data";


const AddUserModal = ({ isOpen, onClose, handleAddUser }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    address: "",
    city: "",
    state: "",
    universityName: "",
    roles: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // 🔄 Reset everything whenever modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setShowPassword(false);
      setDropdownOpen(false);
    }
  }, [isOpen]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  // Handle inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      if (value.length > 10) return;
    }
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({ ...prev, roles: role }));
    setDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.roles
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      const payload = { ...formData, roles: [formData.roles] };
      await createUser(payload);
      toast.success("User created successfully");

      // reset after successful creation
      setFormData(initialFormData);

      if (handleAddUser) handleAddUser();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white z-50 p-4 md:p-6 rounded-3xl overflow-hidden max-w-xl w-[90%] md:w-[60%] max-h-[90vh] shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-black-1">Add User</h2>
          <button
            onClick={onClose}
            type="button"
            aria-label="close modal"
            className="cursor-pointer"
          >
            <RiCloseLine className="text-red-2 text-2xl" />
          </button>
        </div>

        <form
          className="overflow-y-auto max-h-[80vh] pb-7 pr-2"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-3">
            {/* First Name */}
            <div>
              <label className="text-black-1 font-medium text-base block mb-2">
                First name
              </label>
              <input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="text-black-1 font-medium text-base block mb-2">
                Last name
              </label>
              <input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="text-black-1 font-medium text-base block mb-2">
                Email 
              </label>
              <input
                id="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-black-1 font-medium text-base block mb-2">
                Phone number
              </label>
              <input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                type="tel"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* Password */}
            <div className="">
              <label className="text-black-1 font-medium text-base block mb-2">
                Password
              </label>

              <div className="relative">
                <input
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    type={showPassword ? "text" : "password"}
                    className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1 pr-10"
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 transform top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                >
                    {showPassword ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                    ) : (
                    <AiOutlineEye className="text-lg" />
                    )}
                </button>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-black-1 font-medium text-base block mb-2">
                Address
              </label>
              <input
                id="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* City */}
            <div>
              <label className="text-black-1 font-medium text-base block mb-2">
                City
              </label>
              <input
                id="city"
                value={formData.city}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* State */}
            <div>
              <label className="text-black-1 font-medium text-base block mb-2">
                State
              </label>
              <input
                id="state"
                value={formData.state}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>

            {/* Roles */}
            <div className="md:col-span-2 relative" ref={dropdownRef}>
              <label className="text-black-1 font-medium text-base block mb-2">
                Roles <span className="text-red-500">*</span>
              </label>
              <div
                className="w-full border border-gray-2 p-2 rounded cursor-pointer flex items-center justify-between"
                onClick={() => setDropdownOpen((prev) => !prev)}
              >
                {formData.roles || "-- Select Role --"}
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <IoChevronDown className="text-xl text-gray-500" />
                </motion.div>
              </div>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 right-0 bg-white border border-gray-200 mt-1 rounded-lg shadow-lg z-50"
                  >
                    {roles.map((role) => (
                      <li
                        key={role}
                        onClick={() => handleRoleSelect(role)}
                        className="px-4 py-2 hover:bg-red-100 cursor-pointer"
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* University */}
            <div className="md:col-span-2">
              <label className="text-black-1 font-medium text-base block mb-2">
                University name
              </label>
              <input
                id="universityName"
                value={formData.universityName}
                onChange={handleChange}
                type="text"
                className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              type="button"
              className="cursor-pointer border font-bold text-base w-full text-red-1 rounded-3xl py-2"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-red-1 w-full font-bold text-base text-white p-2 rounded-3xl flex items-center justify-center"
            >
              {loading && (
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loading ? "Saving..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;