import api from "./axiosClient";

export const getAllProducts = async () => {

    const response = await api.get("/products/allproducts")

    return response.data;

}

export const deleteProduct = async (id) => {

    await api.delete(`/products/delete/${id}`);

}

export const addProduct = async (data) => {

    const response = await api.post(`/products/addproduct`, data)

    return response.data;

}

export const updateProduct = async (productId, updateData) => {

    const response = await api.put(`/products/update/${productId}`, updateData);

    return response.data;

}