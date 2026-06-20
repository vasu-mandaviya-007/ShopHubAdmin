// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     withCredentials: true,
// });

// export default api;




// import axios from "axios";

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL,
//     // Agar cookies use nahi kar rahe ho toh withCredentials ki zaroorat nahi hai, 
//     // par likha rahe toh koi nuksan bhi nahi hai.
//     withCredentials: true,
// });

// // ── REQUEST INTERCEPTOR ──
// api.interceptors.request.use(
//     (config) => {
//         // Admin panel ka token get karo
//         const token = localStorage.getItem('admin-token');

//         if (token) {
//             // Backend middleware ('fetchAdmin') yahi exact header dhoondta hai
//             config.headers['admin-token'] = token;
//         }

//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// export default api;





import axios from "axios";
import { showToast } from "../components/showToast";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// ── REQUEST INTERCEPTOR (Jo tumne pehle banaya tha) ──
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin-token');
        if (token) {
            config.headers['admin-token'] = token;
        }
        return config;
    },
    (error) => Promise.reject(error)
);
  
// ── RESPONSE INTERCEPTOR (Naya: Error Handle Karne Ke Liye) ──
api.interceptors.response.use(
    (response) => {
        // Agar response success hai toh direct aage bhej do
        return response;
    },
    (error) => {
        // Agar backend ne 401 (Unauthorized / Invalid Token) bheja hai
        if (error.response && error.response.status === 401) {
            console.error("Token Expired or Invalid! Logging out...");

            // 1. LocalStorage se token uda do
            localStorage.removeItem('admin-token');

            showToast("Session expired. Please log in again.", "error");

            // 3. 2 second (2000ms) ka delay dekar redirect karo taaki toast padhne ka time mile
            setTimeout(() => {
                window.location.href = '/admin/login';
            }, 2000);

            // Note: Reject hum yahan bhi return karenge, taaki aage ka code crash na ho
            return new Promise(() => { });
        }

        // Agar 403 (Demo Mode) ya koi aur error hai, toh usko component me catch block ke liye aage bhej do
        return Promise.reject(error);
    }
);

export default api; 