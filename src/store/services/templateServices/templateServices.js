import Axios from "axios";
import appConfig from "../../../constants/appConfig";

const getTemplates = async () => {
  try {
    const response = await Axios.get(`${appConfig.baseUrl}/templates/categories`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching templates:", error);
    throw error;
  }
};
export default getTemplates;
