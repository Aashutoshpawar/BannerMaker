import Axios from "axios";
import appConfig from "../../../constants/appConfig";

export const createProject = async (projectData) => {
    try {
        const response = await Axios.post(`${appConfig.baseUrl}/creations`, projectData);
        return response.data;
    } catch (error) {
        console.error("Error creating project:", error);
        // Optional: throw the error to be handled by caller
        throw error;
    }
};
