import React, { useEffect, useMemo } from "react";
import { Redirect, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from 'expo-blur';
import { StyleSheet } from "react-native";
import { useCartStore } from "@/store/userCartStore";

import useCart from "@/hooks/useCart";

const TabsLayout = () => {
      //implement later, if user signedin not equals to user stored in storage, clear!
      //and store user token in storage or 
      const { cartData, isSuccess, cartError} = useCart()
      
      
      const setItems = useCartStore((state) => state.setItems)
      const cartItems = (cartData?.data?.cart?.items ?? [])
      const totalCartItems = useCartStore((state) => state.getTotalItems());      //sync with zustand
      useEffect(()=>{
        if(isSuccess){
          setItems(cartItems)
          }
      },[cartData])

  
  
  const insets = useSafeAreaInsets();
  const {isSignedIn, isLoaded} = useAuth()
  if(!isLoaded)return null
  if(!isSignedIn) return <Redirect href={"/(auth)"}/>
  return (
    <Tabs
    screenOptions={{
      headerShown:false,
      tabBarActiveTintColor:"#45d7f5",
      tabBarInactiveTintColor:"#B3B3B3",
      tabBarStyle:{
        position:"absolute",
        backgroundColor: "transparent",
        borderTopWidth:0,
        height: 32 + insets.bottom,
        paddingTop:4,
        marginHorizontal: 100,
        marginBottom: insets.bottom,
        borderRadius:34,
        overflow:"hidden"
      },
      tabBarLabelStyle:{
        fontSize: 12,
        fontWeight: 600
      },
      tabBarBackground:()=>(<BlurView intensity={80} tint="dark" style={
        //absolute fill is == position: 0, top: 0, height: 0, left: 0, bottom: 0
        StyleSheet.absoluteFill} />)
    }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown:false,
          title: "shop",
          tabBarIcon: ({ color, size }) => <Ionicons name="grid" size={size} color={color}/>,
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          headerShown:false,
          title: "cart",
          tabBarIcon: ({ color, size }) => <Ionicons name="cart" size={size} color={color}/>,
          tabBarBadge:(totalCartItems) 
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown:false,   
          title: "profile",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color}/>,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
 