import Axios from "axios";
import appConfig from "../../../constants/appConfig";

export const createProject = async (Data) => {
    try {
        const response = await Axios.post(`${appConfig.baseUrl}/creations`, Data);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        // Optional: throw the error to be handled by caller");
        throw error;
    }
};
export const getProjectByUserID = async (Data) => {
    try {
        const response = await Axios.post(`${appConfig.baseUrl}/creations/user`, Data);
        return response.data;
    } catch (error) {
        console.error("something went wrong:", error);
        throw error;
    }
};

export const updateProject = async (id, Data) => {
    try {
        const response = await Axios.put(`${appConfig.baseUrl}/creations/${id}`, Data);
        return response.data;
    } catch (error) {
        console.error("Error updating project:", error);
        throw error; // keep throwing so the caller can handle it
    }
};


export const deleteProject = async (_id) => {
    try {
        const response = await Axios.delete(`${appConfig.baseUrl}/creations`, {
            data: { _id },
        });
        return response.data;
    } catch (error) {
        console.error("❌ Error deleting project:", error);
        throw error;
    }
};
