
import { useEffect, useState } from "react";
import { RiCloseLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { updateProduct } from "../../api/productApi";
import { updateCategory } from "../../api/categoryApi";



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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    }
  }, [product]);

  const capitalizeFirstLetter = (string) =>
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (
      !editTitle ||
      !editPrice ||
      !editCategoryName ||
      !editCategoryDescription
    ) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const capitalizedTitle = capitalizeFirstLetter(editTitle);
      const capitalizedCategoryName = capitalizeFirstLetter(editCategoryName);

      await updateCategory(product.category.id, {
        name: capitalizedCategoryName,
        description: editCategoryDescription,
      });

      const updatedData = {
        title: capitalizedTitle,
        description: editDescription,
        stock: Number(editStock),
        price: Number(editPrice),
        images: [editImage],
        categoryId: product.category.id,
        sizes: editSizes
          ? editSizes.split(",").map((s) => s.trim())
          : [],
        colors: editColors
          ? editColors.split(",").map((c) => c.trim())
          : [],
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
          <p className="text-base font-semibold mb-2">Category Info</p>
          <input
            value={editCategoryName}
            onChange={(e) => setEditCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
          />
          <input
            value={editCategoryDescription}
            onChange={(e) => setEditCategoryDescription(e.target.value)}
            placeholder="Category Description"
            className="w-full border border-gray-2 p-2 mb-4 rounded outline-none focus:border-red-1"
          />

          <p className="text-base font-semibold mb-2">Product Info</p>
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
          />
          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-500"
          />
          <input
            value={editImage}
            onChange={(e) => setEditImage(e.target.value)}
            placeholder="Image URL"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
          />
          <input
            value={editSizes}
            onChange={(e) => setEditSizes(e.target.value)}
            placeholder="Sizes (comma separated, e.g. S,M,L)"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            value={editColors}
            onChange={(e) => setEditColors(e.target.value)}
            placeholder="Colors (comma separated, e.g. red,blue,black)"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="number"
            value={editPrice}
            onChange={(e) => setEditPrice(e.target.value)}
            placeholder="Price"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
            min={0}
          />
          <input
            type="number"
            value={editStock}
            onChange={(e) => setEditStock(e.target.value)}
            placeholder="Stock"
            className="w-full border border-gray-2 p-2 mb-2 rounded outline-none focus:border-red-1"
            min={0}
          />

          {error && <p className="text-red-2 text-sm mt-2">{error}</p>}

          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              className="cursor-pointer border w-full text-red-2 rounded-3xl py-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="cursor-pointer bg-red-1 w-full font-bold text-white p-2 rounded-3xl flex items-center justify-center"
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