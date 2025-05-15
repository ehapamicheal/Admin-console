import axiosInstance from "./axiosInstance";

// GET ALL ORDERS
export const getOrders = async () => {
    try {
        const response = await axiosInstance.get("/admin/orders");
        return response?.data;

    } catch (error) {
        console.error('Error fetching orders', error);
        throw error.response.data || error;
    }
};


// GET ORDERS BY ID
export const getOrdersById = async (id) => {
    try {
        const response = await axiosInstance.get(`/admin/orders/${id}`);
        return response.data; 
    } catch (error) {
        console.error("Error getting orders by Id", error);
        throw error.response?.data || error;
    }
};
