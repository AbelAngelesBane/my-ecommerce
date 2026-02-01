import { useAuth } from "@clerk/clerk-expo"
import axios from "axios"
import { useEffect } from "react"
const API_URL = "https://my-ecommerce-wfm4g.sevalla.app"
const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const useApi = ()=>{
    const {getToken, isSignedIn} = useAuth()
    const isAuthenticated = isSignedIn;
    
    useEffect(()=>{
        //every single request make
        //Submits token to validate in the BE
        const interceptor = api.interceptors.request.use(async (config) =>{
            const token = await getToken();
            if(token){
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        });

        //cleanup: remove interceptor when component unmounts
        return ()=>{
            api.interceptors.request.eject(interceptor)
        }
    },[getToken])

    return {api,isAuthenticated}
}
//on every request, make auth token so that our backend knows we're authentiacted
//attach token to headers