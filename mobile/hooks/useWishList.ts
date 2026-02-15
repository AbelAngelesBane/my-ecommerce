import { useApi } from "@/lib/api"
import { Product } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";



const useWishList = () => {
    const{api} = useApi();
    const queryClient = useQueryClient(); //Master controller, invalidates cache and forces query (ex. [wishlist]) to re-run

    const {data:wishlist, isLoading:isLoadingWishList, isError:isErrorOnWishList} = useQuery({
        queryKey:["wishlist"],
        queryFn:async ()=>{
            const {data} = await api.get<{wishlist: Product[]}>("/users/wishlist");
            return data
        }
    })

    const addToWishListMutation = useMutation({
        mutationFn: async(productId:string)=>{
            const {data} = await api.post<{wishlist:string[]}>("/users/wishlist",{productId});
            return data
        },
        //invalidates query, refetches
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["wishlist"]})},
        onError:(error)=>console.log("Error adding wishlist",(error  as AxiosError).message)
    });

    const removeFromWishListMutation = useMutation({
        mutationFn:async (productId:string)=>{
            const {data} = await api.delete<{wishlist:string[]}>(`/users/wishlist/${productId}`);
            return data.wishlist;
        },
        onSuccess:()=> queryClient.invalidateQueries({queryKey:["wishlist"]})
    });

    const isInWishList = (productId:string)=>{
        return wishlist?.wishlist?.some((item) => item._id === productId) ?? false
    }
    const toggleWishList = (productId: string)=>{
        if(isInWishList(productId)){
            removeFromWishListMutation.mutate(productId);
        }else{
            addToWishListMutation.mutate(productId);
        }
    }

    return {
        wishlist: wishlist || [],
        isLoadingWishList,
        isErrorOnWishList,
        toggleWishList,
        addToWishList:addToWishListMutation,
        removeFromWishList: removeFromWishListMutation,
        isAddingToWishList:addToWishListMutation.isPending,
        isRemovingFromWishList:removeFromWishListMutation.isPending,
        isInWishList
    }
}

export default useWishList