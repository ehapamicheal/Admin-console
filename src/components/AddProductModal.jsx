import { RiCloseLine, RiImageAddFill } from "react-icons/ri";
import { createCategory} from "../api/categoryApi";
import { createProduct } from "../api/productApi";
import { useState } from 'react';
import { toast } from "react-toastify";


const AddProductModal = ({ isOpen, onClose, onAddProduct }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [sizes, setSizes] = useState("");
  const [colors, setColors] = useState("");


  const capitalizeFirstLetter = (string) => 
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!title || !stock || !price || !newCategoryName || !newCategoryDescription || !sizes || !colors) {
      toast.error("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const capitalizedCategory = capitalizeFirstLetter(newCategoryName);
      const newCat = await createCategory({
        name: capitalizedCategory,
        description: newCategoryDescription,
      });

      const capitalizedTitle = capitalizeFirstLetter(title);

      const productData = {
        title: capitalizedTitle,
        description,
        stock: Number(stock),
        price: Number(price),
        images: [image],
        categoryId: newCat.id,
        sizes: sizes.split(",").map((s) => s.trim()),  
        colors: colors.split(",").map((c) => c.trim()), 
      };


      const newProduct = await createProduct(productData);
      toast.success("Product created!");

      onAddProduct(newProduct);
      onClose();
      setTitle("");
      setDescription("");
      setStock("");
      setPrice("");
      setImage("");
      setNewCategoryName("");
      setNewCategoryDescription("");

      setSizes("");
      setColors("");


    } catch (err) {
      console.error(err);
      setError("Failed to add product or category.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="relative bg-white z-50 p-4 md:p-6 rounded-lg w-120 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-black-4">Add Product</h2>
          <RiCloseLine className="cursor-pointer text-red-2 text-2xl" onClick={onClose} />
        </div>

        <form className="overflow-y-auto h-110 pb-2 pr-2" onSubmit={handleSubmit}>
          <p className="text-base font-semibold mb-2">Create Category</p>
          <input
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category Name"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            placeholder="Category Description"
            className="w-full border p-2 mb-4 rounded"
          />

          <p className="text-base font-semibold mb-2">Create Product</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
            className="w-full border p-2 mb-2 rounded"
          />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="w-full border p-2 mb-2 rounded"
            min={0}
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Stock"
            className="w-full border p-2 mb-3 rounded"
            min={0}
          />

            <input
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="Sizes (comma separated, e.g. S,M,L)"
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="Colors (comma separated, e.g. red,blue,black)"
              className="w-full border p-2 mb-2 rounded"
            />


          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;