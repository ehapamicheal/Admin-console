import axiosInstance from "./axiosInstance";

// GET: Fetch all fulfilments
export const getFulfilments = async () => {
  try {
    const response = await axiosInstance.get("/admin/fulfilments");
    return response.data;
  } catch (error) {
    console.error("Error fetching fulfilments", error);
    throw error.response?.data || error;
  }
};

// PATCH: Update fulfilment status
export const updateFulfilmentStatus = async (orderId, status) => {
  try {
    const response = await axiosInstance.patch(`/admin/fulfilments/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error("Error updating status", error);
    throw error.response?.data || error;
  }
};

// POST: Add location history
export const addFulfilmentLocationHistory = async (orderId, location, note) => {
  try {
    const response = await axiosInstance.post(`/admin/fulfilments/${orderId}/location-history`, { location, note });
    return response.data;
  } catch (error) {
    console.error("Error adding location history", error);
    throw error.response?.data || error;
  }
};

// GET: Get location history of an order
export const getFulfilmentLocationHistory = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/admin/fulfilments/${orderId}/location-history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching location history", error);
    throw error.response?.data || error;
  }
};
