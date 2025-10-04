import axiosInstance from "./axiosInstance";


// CREATE NEW USER
export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/admin/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error creating user", error);
    throw error;
  }
};

// GET ALL USERS
export const getAllUsers = async (params = {}) => {
  try {
    const apiParams = {
      page: params.page || 1,
      limit: params.limit || 10,
    };

    if (params.search) {
      apiParams.search = params.search;
    }

    if (params.role) {
      apiParams.role = params.role;
    }

    const response = await axiosInstance.get("/admin/users", { params: apiParams });
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    throw error.response?.data || error;
  }
};



// GET USER BY ID
export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details", error);
    throw error;
  }
};

// BLOCK USER
export const blockUser = async (id) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}/block`);
    return response.data;
  } catch (error) {
    console.error("Error blocking user", error);
    throw error;
  }
};

// UNBLOCK USER
export const unblockUser = async (id) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}/unblock`);
    return response.data;
  } catch (error) {
    console.error("Error unblocking user", error);
    throw error;
  }
};

// ASSIGN ROLES
export const assignRoles = async (id, roles) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}/roles`, { roles });
    return response.data;
  } catch (error) {
    console.error("Error assigning roles", error);
    throw error;
  }
};

// CREATE FULFILMENT AGENT
export const createFulfilmentAgent = async ({userId, assignedState}) => {
  try {
    const response = await axiosInstance.post(`/admin/fulfilment-agents`, {userId, assignedState});
    return response.data;
  } catch (error) {
    console.error("Error creating fulfilment agent", error);
    throw error;
  }
};
