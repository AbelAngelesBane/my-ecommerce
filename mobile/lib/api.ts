import { useAuth } from "@clerk/clerk-expo"
import axios from "axios"
import { useEffect } from "react"
// const API_URL = "https://my-ecommerce-wfm4g.sevalla.app/api"
// const API_URL = "http://localhost:3000/api"
//android
const API_URL = "http://10.0.2.2:3000/api"
const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})


export const useApi = () => {
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        // We add the interceptor but we DON'T eject it on unmount
        // so that the store can keep using the 'api' object
        api.interceptors.request.use(async (config) => {
            const token = await getToken();
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }, [getToken]);

    return { api, isAuthenticated: isSignedIn };
};

// Export the vanilla api instance so Zustand can import it
export { api };
//on every request, make auth token so that our backend knows we're authentiacted
//attach token to headers