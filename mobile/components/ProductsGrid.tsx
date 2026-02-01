import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Product } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import useWishList from "@/hooks/useWishList";

const ProductsGrid = ({ product, onPressPlus, }: { product: Product; onPressPlus: Function; }) => {
  const {
        wishlist,
        isLoadingWishList,
        isErrorOnWishList,
        toggleWishList,
        addToWishList,
        removeFromWishList,
        isAddingToWishList,
        isRemovingFromWishList,
        isInWishList
  } = useWishList();
  const [selected, setSelected] = useState(false);
  const plusButtonRef = useRef<View>(null);
  const handlePress = () => {
    // This function finds the exact [x, y] of the button on the device screen
    plusButtonRef.current?.measureInWindow((x, y, width, height) => {
      // We send the center of the button
      onPressPlus(x + width / 2, y + height / 2, product);
    });
  };
  
  const onPressWishlist = ()=>{
    const inWishList = isInWishList(product._id) 
    setSelected(!inWishList)
    toggleWishList(product._id)
    // if(inWishList)removeFromWishList.mutate(product._id)
    // if(!inWishList)addToWishList.mutate(product._id)
  }

  return (
    <View className="flex-1 m-2 relative rounded-2xl bg-background-lighter">
      <TouchableOpacity
        disabled={isRemovingFromWishList || isAddingToWishList}
        className="absolute top-2 right-2 z-10 bg-slate-400 rounded-full size-10 p-2 items-center justify-center opacity-60"
        onPress={() => onPressWishlist()}
      >
        {(isInWishList(product._id) ?? false) ? (
          <Ionicons name="heart" color={"red"} size={20} />
        ) : (
          <Ionicons name="heart-outline" color={"#ffff"} size={20} />
        )}
      </TouchableOpacity>
      <Image
        source={{ uri: product.images[0] }}
        className="w-full h-32 object-fill rounded-t-lg"
        style={{ resizeMode: "stretch" }}
      />
      <View className="p-2">
        <Text numberOfLines={1} className="text-sm text-text-secondary">
          {product.category}
        </Text>
        <Text numberOfLines={2} className="text-lg text-text-primary">
          {product.name}
        </Text>
        <View className="flex-row gap-2  items-center">
          <Ionicons name="star" color={"gold"} />
          <Text className="text-text-primary">
            {product.averageRating.toFixed(1)}
          </Text>
          <Text className="text-text-secondary">{`(${product.totalReviews})`}</Text>
        </View>
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className="text-primary w-[70%]"
            numberOfLines={2}
          >{`$${product.price.toFixed(2)}`}</Text>
          <TouchableOpacity
            ref={plusButtonRef} // Attach the ref here
            className="w-[20%] items-end justify-end"
            onPress={handlePress}
          >
            <Ionicons name="add-circle" color={"#45d7f5"} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProductsGrid;


