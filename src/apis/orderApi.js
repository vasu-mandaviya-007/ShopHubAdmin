import api from "./axiosClient";

export const getOrders = async () => {

    const response = await api.get("/orders/allorders")

    return response.data;

}

export const deleteOrder = async (id) => {

    await api.delete(`/orders/delete/${id}`); 

}

export const updateOrder = async (orderId,updateData) => {

    const response = await api.put(`/orders/update/${orderId}`, updateData);

    return response.data;

}