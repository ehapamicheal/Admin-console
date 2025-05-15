import axiosInstance from './axiosInstance';

// Create a new category
export const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/admin/categories', categoryData);
    return response.data;
  
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// Get all categories
export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/admin/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};


// Update a category by ID
export const updateCategory = async (id, updatedData) => {
  try {
    const response = await axiosInstance.put(`/admin/categories/${id}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// Delete a category by ID
export const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/categories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};