import { useEffect, useRef, useState } from "react";
import { RiCloseLine, RiArrowDownSLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { updateProduct } from "../../api/productApi";
import { updateCategory, getCategories } from "../../api/categoryApi";

const EditModalProduct = ({ product, onClose, onProductUpdated }) => {
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editSizes, setEditSizes] = useState("");
  const [editColors, setEditColors] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryDescription, setEditCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (product) {
      setEditTitle(product.title || "");
      setEditDescription(product.description || "");
      setEditStock(product.stock !== undefined ? product.stock : "");
      setEditPrice(
        product.price !== undefined
          ? product.price.toString().replace("₦", "").replace(",", "")
          : ""
      );
      setEditImage(product.images?.[0] || "");
      setEditSizes(product.sizes?.join(", ") || "");
      setEditColors(product.colors?.join(", ") || "");
      setEditCategoryName(product.category?.name || "");
      setEditCategoryDescription(product.category?.description || "");
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

  // close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!editTitle || !editPrice || !selectedCategoryId) {
      toast.error("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const capitalizedTitle = capitalizeFirstLetter(editTitle);

      // Update category only if editing the same one
      if (selectedCategoryId === product.category.id) {
        const capitalizedCategoryName = capitalizeFirstLetter(editCategoryName);
        await updateCategory(product.category.id, {
          name: capitalizedCategoryName,
          description: editCategoryDescription,
        });
      }

      const updatedData = {
        title: capitalizedTitle,
        description: editDescription,
        stock: Number(editStock),
        price: Number(editPrice),
        images: [editImage],
        categoryId: selectedCategoryId,
        sizes: editSizes ? editSizes.split(",").map((s) => s.trim()) : [],
        colors: editColors ? editColors.split(",").map((c) => c.trim()) : [],
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
          <RiCloseLine
            className="cursor-pointer text-red-2 text-2xl"
            onClick={onClose}
          />
        </div>

        <form className="overflow-y-auto h-110 pb-2 pr-2" onSubmit={handleUpdate}>
          {/*============ CATEGORY INFO =============*/}
          <div className="mb-5">
            <h3 className="text-base font-semibold mb-4">Category Info</h3>


            {selectedCategoryId === product.category?.id && (
              <>
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-black-1 font-medium text-sm block" htmlFor="name">Category Name</label>

                    <input
                      value={editCategoryName}
                      onChange={(e) => setEditCategoryName(e.target.value)}
                      className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-black-1 font-medium text-sm block" htmlFor="description">Category Description</label>

                  <input
                    value={editCategoryDescription}
                    onChange={(e) => setEditCategoryDescription(e.target.value)}
                    className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                  />
                  </div>
                </div>
              </>
            )}
          </div>

          {/*============ PRODUCT INFO =============*/}
          <div className="">
            <p className="text-base font-semibold mb-4">Product Info</p>

            <div className="space-y-4">
              {/*============  =============*/}
               <div className="relative" ref={dropdownRef}>
                <p className="text-black-1 font-medium text-sm mb-2">Select Category</p>
                <div
                  className="flex justify-between items-center w-full border border-gray-2 p-2 rounded cursor-pointer"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <span className="text-black-1 font-normal text-[15px]">
                    {categories.find((cat) => cat.id === selectedCategoryId)?.name ||
                      "Select Category"}
                  </span>
                  <RiArrowDownSLine
                    className={`text-xl transform transition-transform duration-300 ${
                      dropdownOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                {dropdownOpen && (
                  <div className="absolute top-full left-0 w-full space-y-1 bg-gray-100 border border-gray-2 px-4 py-3 rounded shadow-lg mt-1 z-10 max-h-44 overflow-y-auto">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setDropdownOpen(false);
                        }}
                        className={`px-3 py-2 group cursor-pointer hover:bg-red-1/80 transition-all duration-300 rounded-lg ${
                          selectedCategoryId === cat.id ? "bg-red-1/80" : ""
                        }`}
                      >
                        <p className={`group-hover:text-white font-medium ${selectedCategoryId === cat.id ? "text-white" : " text-black-1"}`}>{cat.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/*============ PRODUCT NAME =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-medium text-sm block" htmlFor="name">Product Name</label>

                <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
              />
              </div>
            
              {/*============  =============*/}
              {/*============ DESCRIPTION =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-medium text-sm block" htmlFor="">Description</label>

                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                />
              </div>

              {/*============ IMAGE URL =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-medium text-sm block" htmlFor="image">Image URL</label>
                <input
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                />
              </div>

              {/*============ SIZE =============*/}
              <div className="flex flex-col gap-2">
                <label  className="text-black-1 font-medium text-sm block" htmlFor="size">Sizes (comma separated, e.g. S,M,L)</label>

                <input
                  value={editSizes}
                  onChange={(e) => setEditSizes(e.target.value)}
                  className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                />
              </div>

              {/*============ COLORS =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-medium text-sm block" htmlFor="color">Colors (comma separated, e.g. red,blue,black)</label>

                <input
                  value={editColors}
                  onChange={(e) => setEditColors(e.target.value)}
                  className="w-full border border-gray-2 p-2 text-[15px] text-black-1 font-normal rounded outline-none focus:border-red-1"
                />
              </div>

              {/*============ PRICE =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-normal" htmlFor="">Price</label>

                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
                  min={0}
                />
              </div>

              {/*============ STOCK =============*/}
              <div className="flex flex-col gap-2">
                <label className="text-black-1 font-normal" htmlFor="">Stock</label>

                <input
                  type="number"
                  value={editStock}
                  onChange={(e) => setEditStock(e.target.value)}
                  className="w-full border border-gray-2 p-2 rounded outline-none focus:border-red-1"
                  min={0}
                />
              </div>

              {/*============ ERROR TEXT =============*/}
              {error && <p className="text-red-2 text-sm mt-2">{error}</p>}
            </div>
          </div>
 
          {/*============ CANCEL AND SAVE BUTTONS =============*/}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              className="cursor-pointer border font-bold text-base w-full text-red-1 rounded-3xl py-2"
              onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-red-1 w-full font-bold text-base text-white p-2 rounded-3xl flex items-center justify-center">
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