import { useEffect, useState } from 'react';
import { BiSearch } from "react-icons/bi";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { RiEdit2Fill } from "react-icons/ri";
import AddProductModal from '../../components/AddProductModal';
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { getProducts } from '../../api/productApi';
import { toast } from "react-toastify";
import EditModalProduct from '../../components/ui/EditModalProduct';
import { deleteProduct } from "../../api/productApi";
import { deleteCategory } from '../../api/categoryApi';

const AddProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const capitalizeFirstLetter = (string) => 
    string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
  

  const fetchProducts = async (page = 1, search = '') => {
    try {

      const response = await getProducts({ page, limit: 10, search });
      console.log("📦 Products from API:", response);
      const productsFromAPI = response.items || [];

      setProducts(productsFromAPI);

      const totalItems = response.total || 0;
      setTotalPages(Math.ceil(totalItems / 10));
    } catch (error) {
      console.error("❌ Failed to fetch products:", error);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts(currentPage, debouncedSearchTerm);
  }, [currentPage, debouncedSearchTerm]);

  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  // const handleDelete = async (id, categoryId) => {
  //   try {
  //     await deleteProduct(id);
  //     toast.success("Product deleted successfully");
  
  //     setProducts(prev => prev.filter(product => product.id !== id));
  
  //     if (categoryId) {
  //       try {
  //         await deleteCategory(categoryId);
  //         toast.success("Category deleted");
  //       } catch (catError) {
  //         console.error("Failed to delete category:", catError);
  //         toast.error("Product deleted, but failed to delete category");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Failed to delete product:", error);
  //     toast.error("Failed to delete product");
  //   }
  // };

   const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
  
      setProducts(prev => prev.filter(product => product.id !== id));
  
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };


  const handleExportCSV = async () => {
    try {
      setExporting(true);
      toast.info("Preparing full product list...");

      const allProducts = [];
      let page = 1;
      let totalPages = 1;

      // Loop through all pages until we fetch everything
      do {
        const response = await getProducts({ page, limit: 10 });
        const productsFromAPI = response.items || [];
        const totalItems = response.total || 0;
        totalPages = Math.ceil(totalItems / 10);

        allProducts.push(...productsFromAPI);
        page++;
      } while (page <= totalPages);

      if (!allProducts.length) {
        toast.error("No products available to export");
        setExporting(false);
        return;
      }

      // CSV headers 
      const headers = [
        "Created Date",
        "Title",
        "Description",
        "Price",
        "Sizes",
        "Category Name",
        "Category Description",
      ];

      // rows
      const rows = allProducts.map((product) => [
        new Date(product.createdAt).toLocaleDateString("en-GB"),
        product.title || "",
        product.description || "",
        Number(product.price).toLocaleString(),
        Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
        product.category?.name || "",
        product.category?.description || "",
      ]);

      // CSV content
      const csvContent =
        [headers, ...rows]
          .map((row) =>
            row
              .map((field) =>
                `"${String(field).replace(/"/g, '""')}"`
              )
              .join(",")
          )
          .join("\n");

      // downloadable CSV file (UTF-8 with BOM for Excel)
      const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "products.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("All products exported successfully!");
    } catch (error) {
      console.error("CSV export failed:", error);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };




  return (
    <>
      <div className="flex gap-3 md:justify-between flex-col md:flex-row">
        <div className="flex items-center gap-2 bg-white shadow p-2 rounded-md w-full md:w-[80%]">
          <BiSearch className="search_icon cursor-pointer text-black-2 text-xl" />
          <input
            className="text-black-1 font-dm-sans placeholder:text-gray-3 text-base px-1 outline-none w-full"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="text-right mt-4 md:mt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="font-bold w-fit text-[15px] text-white bg-red-1 cursor-pointer p-2 rounded-md transition-all duration-150 ease-in-out hover:-translate-y-0.5 active:translate-y-0"
          >
            Add Product
          </button>
        </div>
      </div>

     {/*========== DOWNLOAD CSV BUTTON ==========*/}
      <div className="mt-5">
        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="text-red-1 text-sm w-fit cursor-pointer transition delay-75 hover:bg-red-1 hover:text-white border border-red-1 rounded-3xl py-2 px-3 disabled:opacity-60"
          type="button"
        >
          {exporting ? (
            <p className="flex items-center"><span className="mr-3 h-4 w-4 border-2 border-t-transparent border-black-3 rounded-full animate-spin "></span> Preparing...</p>
          ) : (
            <p className="">Export as CSV</p>
          )}
        </button>
      </div>

      {/*========== PRODUCTS TABLE ==========*/}
      <div className="mt-8 bg-white rounded-lg shadow-md">
        <div className="pb-2 overflow-x-auto">
          <table className="w-full border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-2">
                <th className="product_th text-left pl-4">Category</th>
                <th className="product_th text-left">Products</th>
                <th className="product_th text-center">Price</th>
                <th className="product_th text-center">Date created</th>
                <th className="product_th text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-2">
                  <td className="pl-4 py-2 text-grey-1 product_tr_td responsive-column2">{capitalizeFirstLetter(product.category?.name || "Uncategorized")}</td>
                  <td className="py-2 responsive-column3">
                    <div className="flex items-center justify-items-start gap-2">
                      <div className="group overflow-hidden bg-gray-6 rounded-lg w-9 h-9 p-1">
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/50"}
                          alt={product.title}
                          className="object-cover transition-all ease-in-out duration-300 group-hover:scale-111 w-full h-full"
                        />
                      </div>
                      <p className="text-grey-1 product_tr_td">{capitalizeFirstLetter(product.title)}</p>
                    </div>
                  </td>
                  <td className="py-2 text-grey-1 text-center product_tr_td responsive-column2">{`₦${Number(product.price).toLocaleString()}`}</td>
                  <td className="py-2 text-grey-1 text-center product_tr_td responsive-column4">{new Date(product.createdAt).toLocaleDateString("en-GB")}</td>
                  <td className="py-2 responsive-column">
                    <div className="flex gap-x-2 items-center justify-center">
                      <RiEdit2Fill
                        className="text-green-2 cursor-pointer"
                        onClick={() => setEditingProduct(product)}
                      />


                      {/* <RiDeleteBin5Fill
                        className="text-red-1 cursor-pointer"
                        onClick={() => handleDelete(product.id, product.category?.id)}
                      /> */}

                      <RiDeleteBin5Fill
                        className="text-red-1 cursor-pointer"
                        onClick={() => handleDelete(product.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

        <div className="page_box flex flex-col row- sm:flex-row sm:justify-between sm:items-center p-3 lg:p-4">
          <div className="">
            <span>Page {currentPage} of {totalPages}</span>
          </div>

            <div className="flex gap-2 items-center mt-3 justify-end sm:mt-0 sm:justify-normal">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}
                className="border rounded-3xl py-1 border-red-1 px-2 cursor-pointer w-9 h-9 disabled:opacity-50 hover:bg-red-1 group">
                <IoIosArrowBack className="text-red-1 group-hover:text-white" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1) return true;
                  return false;
                })
                .reduce((acc, page, i, arr) => {
                  if (i > 0 && page - arr[i - 1] > 1) {
                    acc.push("ellipsis");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, index) =>
                  item === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="px-2">...</span>
                  ) : (
                    <button
                      key={`page-${item}`}
                      onClick={() => setCurrentPage(item)}
                      className={`px-3 py-1 font-normal text-sm rounded-3xl w-9 h-9 cursor-pointer ${
                        currentPage === item
                          ? "bg-dash-grey-2 border border-red-1 text-black"
                          : "hover:bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="border rounded-3xl py-1 border-red-1 px-2 cursor-pointer w-9 h-9 disabled:opacity-50"
              >
                <IoIosArrowForward className="text-red-1" />
              </button>
            </div>
        </div>

      </div>


      {/*========== ADD PRODUCT MODAL ==========*/}
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />

      {/*========== EDIT PRODUCT MODAL ==========*/}
      {editingProduct && (
        <EditModalProduct
          isOpen={true}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={() => fetchProducts(currentPage)}
        />
      )}
    </>
  );
};

export default AddProducts;