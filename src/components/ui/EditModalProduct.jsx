import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { updateProduct } from "../../api/productApi";
import { updateCategory, getCategories } from "../../api/categoryApi";


const EditModalProduct = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    stock: "",
    price: "",
    image: "",
    sizes: "",
    colors: "",
    categoryName: "",
    categoryDescription: "",
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  // Populate fields when editing
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        description: product.description || "",
        stock: product.stock ?? "",
        price:
          product.price !== undefined
            ? product.price.toString().replace("₦", "").replace(",", "")
            : "",
        image: product.images?.[0] || "",
        sizes: product.sizes?.join(", ") || "",
        colors: product.colors?.join(", ") || "",
        categoryName: product.category?.name || "",
        categoryDescription: product.category?.description || "",
      });
      setSelectedCategoryId(product.category?.id || "");
    }
  }, [product]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { title, description, stock, price, image, sizes, colors, categoryName, categoryDescription } = formData;

    if (!title || !price || !selectedCategoryId) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const capitalizedTitle = capitalizeFirstLetter(title);

      if (selectedCategoryId === product.category.id) {
        const capitalizedCategoryName = capitalizeFirstLetter(categoryName);
        await updateCategory(product.category.id, {
          name: capitalizedCategoryName,
          description: categoryDescription,
        });
      }

      const updatedData = {
        title: capitalizedTitle,
        description,
        stock: Number(stock),
        price: Number(price),
        images: [image],
        categoryId: selectedCategoryId,
        sizes: sizes ? sizes.split(",").map((s) => s.trim()) : [],
        colors: colors ? colors.split(",").map((c) => c.trim()) : [],
      };

      await updateProduct(product.id, updatedData);
      toast.success("Product updated successfully!");
      onProductUpdated();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      setError("Failed to update product. Please try again.");
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

      <div className="relative bg-white z-50 p-4 md:p-6 rounded-lg w-120 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black-4">Edit Product</h2>
          <button type="button" className="cursor-pointer group" onClick={onClose}>
            <RiCloseLine className="transition group-hover:rotate-90 duration-500 text-red-2 text-2xl" />
          </button>
        </div>

        <form className="overflow-y-auto h-110 pb-2 pr-2" onSubmit={handleUpdate}>
          {/* Category Info */}
          <div className="mb-5">
            <h3 className="text-base font-semibold mb-4">Category Info</h3>
            {selectedCategoryId === product.category?.id && (
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-black-1 font-medium text-sm">Category Name</label>
                  <input
                    name="categoryName"
                    value={formData.categoryName}
                    onChange={handleChange}
                    className="w-full border border-gray-2 p-2 text-[15px] text-black-1 rounded outline-none focus:border-red-1"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-black-1 font-medium text-sm">Category Description</label>
                  <input
                    name="categoryDescription"
                    value={formData.categoryDescription}
                    onChange={handleChange}
                    className="w-full border border-gray-2 p-2 text-[15px] text-black-1 rounded outline-none focus:border-red-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <p className="text-base font-semibold mb-4">Product Info</p>
            <div className="space-y-4">
              {/* Category dropdown */}
              <div className="relative" ref={dropdownRef}>
                <p className="text-black-1 font-medium text-sm mb-2">Select Category</p>
                <div
                  className="flex justify-between items-center w-full border border-gray-2 p-2 rounded cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <span className="text-black-1 text-[15px]">
                    {categories.find((cat) => cat.id === selectedCategoryId)?.name || "Select Category"}
                  </span>
                  <RiArrowDownSLine
                    className={`text-xl transform transition-transform duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"}`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-gray-100 border border-gray-2 px-4 py-3 rounded shadow-lg mt-1 z-10 max-h-44 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setDropdownOpen(false);
                        }}
                        className={`px-3 py-2 group cursor-pointer hover:bg-red-1/80 rounded-lg ${
                          selectedCategoryId === cat.id ? "bg-red-1/80" : ""
                        }`}
                      >
                        <p
                          className={`group-hover:text-white font-medium ${
                            selectedCategoryId === cat.id ? "text-white" : "text-black-1"
                          }`}
                        >
                          {cat.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product fields */}
              {[
                { label: "Product Name", name: "title" },
                { label: "Description", name: "description" },
                { label: "Image URL", name: "image" },
                { label: "Sizes (comma separated, e.g. S,M,L)", name: "sizes" },
                { label: "Colors (comma separated, e.g. red,blue,black)", name: "colors" },
              ].map(({ label, name }) => (
                <div key={name} className="flex flex-col gap-2">
                  <label className="text-black-1 font-medium text-sm">{label}</label>
                  <input
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    className="w-full border border-gray-2 p-2 text-[15px] text-black-1 rounded outline-none focus:border-red-1"
                  />
                </div>
              ))}

              {/* Price */}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-normal">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
                  min={0}
                />
              </div>

              {/* Stock */}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-normal">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
                  min={0}
                />
              </div>

              {error && <p className="text-red-2 text-sm mt-2">{error}</p>}
            </div>
          </div>

          {/*============ BUTTONS =============*/}
          <div className="flex items-center justify-center gap-3 mt-4">
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
              {loading ? (
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
              ) : null}
              {loading ? "Saving..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModalProduct;