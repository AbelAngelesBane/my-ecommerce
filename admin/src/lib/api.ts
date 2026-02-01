import axiosInstance from "./axios";


export const productApi = {
    getAll: async (limit:number) => {
        const {data} = await axiosInstance.get("admin/products",{
            params:{
                limit:limit
            }
        });
        return data;
    },

    // createAlt: async ({ name, price, description }: CreateProductParams) => {
    //     const { data } = await axiosInstance.post("/admin/products", { name, price, description });
    //     return data;
    // }
    create: async  (formData:FormData) => {
        const {data} = await axiosInstance.post("admin/products", formData);
        return data;
    },
    update: async ({id, formData}:{id:string, formData: FormData}) => {
        const {data} = await axiosInstance.put(`admin/products/${id}`, formData)
        return data;
    },
    patch:async (id:string)=>{
        // data returns full axios response, {data} destructures
        const {data} = await axiosInstance.patch(`admin/products/${id}/archive`);
        return data;
    }
}

export const orderApi = {
    getAll: async () =>{
        const {data} = await axiosInstance.get("admin/orders");
        return data;
    },

    updateStatus: async({orderId, status}:{orderId:string, status: string}) => {
        const {data} = await axiosInstance.patch(`admin/orders/${orderId}/status`, {status});
        return data;
    }
}

export const statsApi = {
    getDashboard: async ()=> {
        const {data} = await axiosInstance.get("admin/stats");
        return data;
    }
}

export const customerApi = {
    getAll: async ()=>{
        const {data} = await axiosInstance.get(`admin/customers`);
        return data
    }
}