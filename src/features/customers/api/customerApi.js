import api from "../../../apis/axiosClient";

export const getAllCustomers = async () => {

    const response = await api.get("/account/allusers")

    return response.data;

}

export const deleteCustomer = async (customerId) => {

    const response = await api.delete(`/account/admin/delete/${customerId}`);

    return response.data;

}

export const updateCustomer = async (customerId, updateData) => {

    const response = await api.put(`/account/admin/update/${customerId}`, updateData);

    return response.data;

}