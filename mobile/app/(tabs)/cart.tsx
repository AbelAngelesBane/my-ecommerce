import { View, Text, FlatList, RefreshControl, TouchableOpacity } from "react-native";
import SafeScreen from "@/components/SafeScreen";
import ProductGridCart from "@/components/ProductGridCart";
import { useMemo, useState } from "react";
import { useCartStore } from "@/store/userCartStore";
import { useQueryClient } from "@tanstack/react-query";


//TODOS: Clear cart on logout
const CartScreen = () => {
  const queryClient = useQueryClient()
  //Stored
  const storedCart = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const [isRefreshing, setIsRefreshing] = useState(false)
const subTotal = useMemo(() => {
  return storedCart.reduce((sum, item) => {
    // If selected, add price. If NOT, just return the sum accumulated so far.
    return item.product.isSelected === true 
      ? sum + (item.product.price * item.quantity) 
      : sum; 
  }, 0);
}, [storedCart]);
  //update in storage and api
  const handleUpdateQuantity = ({ productId, quantity }: { productId: string, quantity: number }) => {
    updateQuantity(productId, quantity)
  } 


  const onRefresh =async()=>{
    setIsRefreshing(true)
    await queryClient.invalidateQueries({queryKey:["cart"]})
    setIsRefreshing(false)
  }

  return (
    <SafeScreen>
      {(subTotal) !== 0 && <Text>Delete</Text>}
      {
        <FlatList
          className="flex-2"
          refreshControl={
            <RefreshControl
              colors={["#45d7f5"]} // Android
              tintColor={"#45d7f5"}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
            />
          }
          data={storedCart}
          keyExtractor={(item) => item._id}
          numColumns={1}
          renderItem={({ item }) => <ProductGridCart updateQuantity={(productId: string, quantity: number) => handleUpdateQuantity({ productId, quantity })} product={item} />} />
      }
      <View className=" mt-2 h-[25%] bg-background-lighter p-4">
        <View className="flex-row m-2 justify-end p-2 w-full items-end">
          <Text className="text-text-secondary text-2xl">Subtotal: </Text>
          <Text className="text-text-primary text-2xl font-bold ">{` ${subTotal.toFixed(2)}`}</Text>
        </View>
        <View className="">
          <TouchableOpacity
          disabled={(subTotal) !== 0 ? false : true}
          className={`size-12 w-full ${(subTotal) !== 0 ? `bg-primary` : `bg-[#666666]`}  rounded-xl items-center justify-center`}>
            <Text className="text-text-primary font-bold text-xl">Checkout</Text>
          </TouchableOpacity>
        </View>

  
        
      </View>

    </SafeScreen>
  );
};

export default CartScreen;
