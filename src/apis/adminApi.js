import api from "./axiosClient";


export const sendOtp = async (email) => {

    const response = await api.post("/admin/auth/send-otp", email)

    return response.data;

}

export const verifyOtp = async (data) => {

    const response = await api.post("/admin/auth/verify-otp", data)

    return response.data;

}


export const getProfile = async () => {

    const response = await api.get("/admin/auth/me");

    return response.data;

}


export const updateProfile = async (updateData) => {

    const response = await api.put("admin/auth/update", updateData);

    return response.data;


}


export const getAppearance = async () => {


    const response = await api.get("/admin/appearance-settings");

    return response.data;

}

export const updateAppearance = async (updateData) => {


    const response = await api.put("/admin/appearance-settings", updateData);

    return response.data;

}


export const getStoreSettings = async () => {


    const response = await api.get("/admin/store-settings");

    return response.data;

}

export const updateStoreSettings = async (updateData) => {


    const response = await api.put("/admin/store-settings", updateData);

    return response.data;

}


export const getNotificationSettings = async () => {


    const response = await api.get("/admin/notification-settings");

    return response.data;

}

export const updateNotificationSettings = async (updateData) => {


    const response = await api.put("/admin/notification-settings", updateData);

    return response.data;

}


export const exportData = async () => {

    const response = await api.get('/admin/export-data', { responseType: 'blob' });

    return response;

}


export const clearCache = async () => {

    const response = await api.post("/admin/clear-cache");

    return response.data;

}


export const deleteAccount = async () => {

    const response = await api.delete("/admin/delete-account");

    return response.data;

}