import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useApi } from "@/lib/api"
import { Cart} from "@/types/types"
import { AxiosError } from "axios";
import { Alert } from "react-native";


const useCart = () => {

    const {api} = useApi();
    const queryClient = useQueryClient();


    const addToCartMutation = useMutation({
        mutationFn: async({productId, quantity}:{productId:string, quantity?:number})=>{
            const {data} = await api.post<{cart:Cart}>("/cart",{productId,quantity})
            return data.cart
        },onSuccess:()=> queryClient.invalidateQueries({queryKey:["cart"]})
    })
    const {data:cartData, isSuccess,isLoading, error}= useQuery({
            queryKey:["cart"],
            queryFn:async()=>await api.get<{cart:Cart}>("/cart"),
            
        })

    const updateQuantity = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string, quantity: number }) => {
            const response = await api.put<{ cart: Cart }>(`/cart/${productId}`, { quantity });
            return response.data.cart; 
        },
        onError: (error) => {
            console.error("Mutation Error:", error);
            Alert.alert("Something went wrong", "Please check your connectivity");
        }
    });

    return {
        addToCart:addToCartMutation,
        isAddingToCart: addToCartMutation.isPending,
        cartData,
        isSuccess,
        cartError:(error as AxiosError),
        isLoading, 
        updateQuantity
    }
}

export default useCart