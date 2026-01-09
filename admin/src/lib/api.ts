import axiosInstance from "./axios";



interface ProductParams {
    name: string,
    description: string,
    price: number,
    stock: number,
    category: string,
    images:File
}


export const productApi = {
    getAll: async () => {
        const {data} = await axiosInstance.get("/admin/products");
        return data;
    },

    // createAlt: async ({ name, price, description }: CreateProductParams) => {
    //     const { data } = await axiosInstance.post("/admin/products", { name, price, description });
    //     return data;
    // }
    create: async  (formData:ProductParams) => {
    const {data} = await axiosInstance.post("/admin/products", formData);
    return data;
    },
    update: async ({id, formData}:{id:string, formData: ProductParams}) => {
        const {data} = await axiosInstance.put(`/admin/products/${id}`, formData)
        return data;
    }
}

export const orderApi = {
    getAll: async () =>{
        const {data} = await axiosInstance.get("/admin/orders");
        return data;
    },

    updateStatus: async({orderId, status}:{orderId:string, status: string}) => {
        const {data} = await axiosInstance.patch(`/admin/orders/${orderId}/status`, {status});
        return data;
    }
}

export const statsApi = {
    getDashboard: async ()=> {
        const {data} = await axiosInstance.get("/admin/stats");
        return data;
    }
}