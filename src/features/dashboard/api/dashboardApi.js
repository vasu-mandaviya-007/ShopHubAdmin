import api from "../../../apis/axiosClient";

export const getDashboardData = async () => {

    const response = await api.get("/dashboard/summary")

    return response.data;

}