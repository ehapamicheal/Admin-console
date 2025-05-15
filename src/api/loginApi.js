import axios from "axios";
import { BASE_URL } from "../config/apiConfig";

export const loginUser = async ({ phoneNumber, password }) => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, {
            phoneNumber,
            password,
        });
        
        return response.data;
    } catch (error) {
        console.error("Login failed", error);
        throw error;
    }
};

