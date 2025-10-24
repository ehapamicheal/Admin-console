import { RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { createCategory, getCategories } from "../api/categoryApi";
import { createProduct } from "../api/productApi";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";



const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stock: "",
    price: "",
    image: "",
    newCategoryName: "",
    newCategoryDescription: "",
    selectedCategoryId: "",
    sizes: "",
    colors: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      stock: "",
      price: "",
      image: "",
      newCategoryName: "",
      newCategoryDescription: "",
      selectedCategoryId: "",
      sizes: "",
      colors: "",
    });
    setError("");
    setDropdownOpen(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const {
      title,
      stock,
      price,
      sizes,
      colors,
      newCategoryName,
      newCategoryDescription,
      selectedCategoryId,
      description,
      image,
    } = formData;

    if (!title || !stock || !price || !sizes || !colors) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    let categoryIdToUse = selectedCategoryId;

    try {
      if (!selectedCategoryId) {
        if (!newCategoryName || !newCategoryDescription) {
          toast.error("Please provide a category name and description.");
          setLoading(false);
          return;
        }

        const capitalizedCategory = capitalizeFirstLetter(newCategoryName);
        const newCat = await createCategory({
          name: capitalizedCategory,
          description: newCategoryDescription,
        });
        categoryIdToUse = newCat.id;
      }

      const capitalizedTitle = capitalizeFirstLetter(title);

      const productData = {
        title: capitalizedTitle,
        description,
        stock: Number(stock),
        price: Number(price),
        images: [image],
        categoryId: categoryIdToUse,
        sizes: sizes.split(",").map((s) => s.trim()),
        colors: colors.split(",").map((c) => c.trim()),
      };

      const newProduct = await createProduct(productData);
      toast.success("Product created!");
      onAddProduct(newProduct);
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Failed to add product or category.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const categoryIsValid =
    formData.selectedCategoryId ||
    (formData.newCategoryName && formData.newCategoryDescription);

  const allFilled =
    formData.title &&
    formData.stock &&
    formData.price &&
    formData.sizes &&
    formData.colors &&
    categoryIsValid;


  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      <div className="relative bg-white z-50 rounded-lg w-120 shadow-lg max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center mb-5 pt-4 px-4 md:pt-6 md:px-6">
          <h2 className="text-lg md:text-xl font-bold text-black-4">
            Add Product
          </h2>

          <button
            onClick={handleClose}
            type="button"
            className="cursor-pointer group"
            aria-label="close modal"
          >
            <RiCloseLine className="text-red-2 text-2xl transition group-hover:rotate-90 duration-500" />
          </button>
        </div>

        <form
          className="overflow-y-auto max-h-[80vh] pb-8 px-4 md:px-5"
          onSubmit={handleSubmit}
        >
          <p className="text-base font-semibold mb-2">Create Category</p>

          <input
            name="newCategoryName"
            value={formData.newCategoryName}
            onChange={handleChange}
            placeholder="Category Name"
            className="w-full border border-gray-2 p-2 mb-4 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
            disabled={!!formData.selectedCategoryId}
          />
          
          <input
            name="newCategoryDescription"
            value={formData.newCategoryDescription}
            onChange={handleChange}
            placeholder="Category Description"
            className="w-full border border-gray-2 p-2 mb-4 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
            disabled={!!formData.selectedCategoryId}
          />

          <p className="text-base font-semibold mb-2">Create Product</p>
          <div className="mb-2 relative" ref={dropdownRef}>
            <div
              className="flex justify-between items-center w-full border border-gray-2 p-2 rounded cursor-pointer"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              <span className="text-black-1 font-normal text-[15px]">
                {categories.find(
                  (cat) => cat.id === formData.selectedCategoryId
                )?.name || "Choose category"}
              </span>
              <RiArrowDownSLine
                className={`text-xl transform transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {dropdownOpen && (
              <div className="absolute top-full left-0 w-full space-y-1 px-4 py-3 bg-white border border-gray-2 rounded shadow-lg mt-1 z-10 max-h-44 overflow-y-auto">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        selectedCategoryId: cat.id,
                      }));
                      setDropdownOpen(false);
                    }}
                    className={`px-3 py-2 group cursor-pointer hover:bg-red-1/80 transition-all duration-300 rounded-lg ${
                      formData.selectedCategoryId === cat.id
                        ? "bg-red-1/80"
                        : ""
                    }`}
                  >
                    <p
                      className={`group-hover:text-white font-medium ${
                        formData.selectedCategoryId === cat.id
                          ? "text-white"
                          : " text-black-1"
                      }`}
                    >
                      {cat.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Product name"
            className="w-full border border-gray-2 p-2 mb-2 text-black-1 placeholder:text-black-1 rounded outline-none focus:border-red-1 placeholder:text-sm"
          />
          <input
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
          />
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
            min={0}
          />
          <input
            name="stock"
            type="number"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
            min={0}
          />
          <input
            name="sizes"
            value={formData.sizes}
            onChange={handleChange}
            placeholder="Sizes (comma separated, e.g. S,M,L)"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
          />
          <input
            name="colors"
            value={formData.colors}
            onChange={handleChange}
            placeholder="Colors (comma separated, e.g. red,blue,black)"
            className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
          />

          {error && (
            <p className="text-red-500 text-sm mt-2 font-normal">{error}</p>
          )}

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              className="cursor-pointer border w-full text-red-2 rounded-3xl py-2"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !allFilled}
              className={`w-full font-bold text-white p-2 rounded-3xl flex items-center justify-center ${
                loading || !allFilled
                  ? "bg-red-1/70 cursor-not-allowed"
                  : "bg-red-1 cursor-pointer"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;



// const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [stock, setStock] = useState("");
//   const [price, setPrice] = useState("");
//   const [image, setImage] = useState("");
//   const [newCategoryName, setNewCategoryName] = useState("");
//   const [newCategoryDescription, setNewCategoryDescription] = useState("");
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [sizes, setSizes] = useState("");
//   const [colors, setColors] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   const dropdownRef = useRef(null);

//   const capitalizeFirstLetter = (string) =>
//     string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

//   const resetForm = () => {
//     setTitle("");
//     setDescription("");
//     setStock("");
//     setPrice("");
//     setImage("");
//     setNewCategoryName("");
//     setNewCategoryDescription("");
//     setSelectedCategoryId("");
//     setSizes("");
//     setColors("");
//     setError("");
//     setDropdownOpen(false);
//   };

//   const handleClose = () => {
//     resetForm();
//     onClose();
//   };

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await getCategories();
//         setCategories(res);
//       } catch (err) {
//         console.error("Failed to fetch categories", err);
//       }
//     };

//     if (isOpen) {
//       fetchCategories();
//     }
//   }, [isOpen]);

//   // close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     if (!title || !stock || !price || !sizes || !colors) {
//       toast.error("Please fill in all required fields.");
//       setLoading(false);
//       return;
//     }

//     let categoryIdToUse = selectedCategoryId;

//     try {
//       if (!selectedCategoryId) {
//         if (!newCategoryName || !newCategoryDescription) {
//           toast.error("Please provide a category name and description.");
//           setLoading(false);
//           return;
//         }

//         const capitalizedCategory = capitalizeFirstLetter(newCategoryName);
//         const newCat = await createCategory({
//           name: capitalizedCategory,
//           description: newCategoryDescription,
//         });
//         categoryIdToUse = newCat.id;
//       }

//       const capitalizedTitle = capitalizeFirstLetter(title);

//       const productData = {
//         title: capitalizedTitle,
//         description,
//         stock: Number(stock),
//         price: Number(price),
//         images: [image],
//         categoryId: categoryIdToUse,
//         sizes: sizes.split(",").map((s) => s.trim()),
//         colors: colors.split(",").map((c) => c.trim()),
//       };

//       const newProduct = await createProduct(productData);
//       toast.success("Product created!");

//       onAddProduct(newProduct);
//       handleClose(); 
//     } catch (err) {
//       console.error(err);
//       setError("Failed to add product or category.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex justify-center items-center">
//       <div
//         className="absolute inset-0 bg-black opacity-50"
//         onClick={handleClose}
//       ></div>

//       <div className="relative bg-white z-50 rounded-lg w-120 shadow-lg max-h-[90vh] overflow-hidden">
//         <div className="flex justify-between items-center mb-5 pt-4 px-4 md:pt-6 md:px-6">
//           <h2 className="text-lg md:text-xl font-bold text-black-4">Add Product</h2>

//           <button onClick={handleClose} type="button" className="cursor-pointer group" aria-label="close modal">
//             <RiCloseLine
//                 className="text-red-2 text-2xl transition group-hover:rotate-90 duration-500"
//             />
//           </button>
//         </div>

//         <form
//           className="overflow-y-auto max-h-[80vh] pb-8 px-4 md:px-5"
//           onSubmit={handleSubmit}
//         >
//           <p className="text-base font-semibold mb-2">Create Category</p>

//           <input
//             value={newCategoryName}
//             onChange={(e) => setNewCategoryName(e.target.value)}
//             placeholder="Category Name"
//             className="w-full border border-gray-2 p-2 mb-4 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//             disabled={!!selectedCategoryId}
//           />
//           <input
//             value={newCategoryDescription}
//             onChange={(e) => setNewCategoryDescription(e.target.value)}
//             placeholder="Category Description"
//             className="w-full border border-gray-2 p-2 mb-4 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//             disabled={!!selectedCategoryId}
//           />

//           <p className="text-base font-semibold mb-2">Create Product</p>
//           <div className="mb-2 relative" ref={dropdownRef}>
//             {/* Custom Dropdown (same position as your previous select) */}
//             <div
//               className="flex justify-between items-center w-full border border-gray-2 p-2 rounded cursor-pointer"
//               onClick={() => setDropdownOpen((prev) => !prev)}
//             >
//               <span className="text-black-1 font-normal text-[15px]">
//                 {categories.find((cat) => cat.id === selectedCategoryId)?.name ||
//                   "Choose category"}
//               </span>
//               <RiArrowDownSLine
//                 className={`text-xl transform transition-transform duration-300 ${
//                   dropdownOpen ? "rotate-180" : "rotate-0"
//                 }`}
//               />
//             </div>

//             {dropdownOpen && (
//               <div className="absolute top-full left-0 w-full space-y-1 px-4 py-3 bg-white border border-gray-2 rounded shadow-lg mt-1 z-10 max-h-44 overflow-y-auto">
//                 {categories.map((cat) => (
//                   <div
//                     key={cat.id}
//                     onClick={() => {
//                       setSelectedCategoryId(cat.id);
//                       setDropdownOpen(false);
//                     }}
//                     className={`px-3 py-2 group cursor-pointer hover:bg-red-1/80 transition-all duration-300 rounded-lg ${
//                       selectedCategoryId === cat.id ? "bg-red-1/80" : ""
//                     }`}
//                   >
//                    <p className={`group-hover:text-white font-medium ${selectedCategoryId === cat.id ? "text-white" : " text-black-1"}`}>{cat.name}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="Product name"
//             className="w-full border border-gray-2 p-2 mb-2 text-black-1 placeholder:text-black-1 rounded outline-none focus:border-red-1 placeholder:text-sm"
//           />
//           <input
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Description"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//           />
//           <input
//             value={image}
//             onChange={(e) => setImage(e.target.value)}
//             placeholder="Image URL"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//           />
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             placeholder="Price"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//             min={0}
//           />
//           <input
//             type="number"
//             value={stock}
//             onChange={(e) => setStock(e.target.value)}
//             placeholder="Stock"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//             min={0}
//           />

//           <input
//             value={sizes}
//             onChange={(e) => setSizes(e.target.value)}
//             placeholder="Sizes (comma separated, e.g. S,M,L)"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//           />
//           <input
//             value={colors}
//             onChange={(e) => setColors(e.target.value)}
//             placeholder="Colors (comma separated, e.g. red,blue,black)"
//             className="w-full border border-gray-2 p-2 mb-2 text-[15px] text-black-1 placeholder:text-black-1 font-normal rounded outline-none focus:border-red-1 placeholder:text-sm"
//           />

//           {error && <p className="text-red-500 text-sm mt-2 font-normal">{error}</p>}

//           <div className="flex items-center justify-center gap-3 mt-4">
//             <button
//               type="button"
//               className="cursor-pointer border w-full text-red-2 rounded-3xl py-2"
//               onClick={handleClose}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="cursor-pointer bg-red-1 w-full font-bold text-white p-2 rounded-3xl flex items-center justify-center"
//             >
//               {loading ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddProductModal;
