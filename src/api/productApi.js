import axiosInstance from "./axiosInstance";

export const createProduct = async (data) => {
  try {
    const response = await axiosInstance.post('/admin/products', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getProducts = async (params = {}) => {
  try {
    const apiParams = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.search) {
      apiParams.search = params.search;
    }

    const response = await axiosInstance.get('/admin/products', { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response?.data || error;
  }
};

// 3. Update product by ID
export const updateProduct = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/admin/products/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// 4. Delete product by ID
export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};