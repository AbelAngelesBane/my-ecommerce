import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import SafeScreen from '@/components/SafeScreen'
import { useAuth, useUser } from '@clerk/clerk-expo'
import { Image } from "expo-image"
import { Ionicons } from '@expo/vector-icons'
import { router } from 'expo-router'


const MENU_ITEMS = [
  { id: 1, icon: "person-outline", title: "Edit profile", color: "#2986CC", action: "/profile" },
  { id: 2, icon: "list-outline", title: "Orders", color: "#10B981", action: "/orders" },
  { id: 3, icon: "location-outline", title: "Address", color: "#F59E0B", action: "/address" },
  { id: 4, icon: "heart-outline", title: "Wishlist", color: "#EF4444", action: "/wishlist" },
] as const
const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    if (action === "/profile") return
    //router.push()
  };

  const handleSignOut = async ()=>{
    try {
      await signOut()
      
    } catch (error) {
      Alert.alert("Something went wrong","Please check your internet connection or try again later")
    }
  }

  return (
    <SafeScreen>
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}>
        <View className='px-6 pb-8'>
          <View className='bg-surface rounded-3xl p-6'>
            <View className='flex-row items-center'>
              <View className='relative'>
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200} />
                <View className='absolute -bottom-1 -right-1 bg-green-300 rounded-full size-7 items-center justify-center border-2 border-surface'>
                  <Ionicons name='checkmark' size={16} color={"#121212"} />
                </View>

              </View>
              <View className='flex-1 ml-4'>
                <Text className='text-text-primary font-bold mb-1 text-2xl'>{user?.firstName}{" "}{user?.lastName}</Text>
                <Text className='text-sm text-text-secondary'>{user?.emailAddresses[0].emailAddress}</Text>
              </View>
            </View>
          </View>
        </View>
        <View className='flex-row flex-wrap mx-6 gap-2 mb-3'>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              className='bg-surface rounded-3xl p-6 items-center justify-center mb-3'
              style={{ width: "48%" }}>
              <View
                style={{
                  backgroundColor: item.color + "20",
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className='mb-4'>
                <Ionicons name={item.icon as any} size={30} color={item.color} />
              </View>
              <Text className='text-text-primary font-bold text-base'>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <View className='mb-3 mx-3 bg-surface rounded-2xl p-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between py-2'
            activeOpacity={0.7}>
            <View className='flex-row items-center gap-2'>
              <Ionicons name='notifications-outline' size={22} color={"#ffff"} />
              <Text className='text-text-primary font-semibold'>Notifications</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={"#666"} />
          </TouchableOpacity>
        </View>

        {/* Privacy and Security */}
        <View className='mb-3 mx-3 bg-surface rounded-2xl p-4'>
          <TouchableOpacity
            className='flex-row items-center justify-between py-2'
            activeOpacity={0.7}
          >
            <View className='flex-row items-center gap-2'>
              <Ionicons name='notifications-outline' size={22} color={"#ffff"} />
              <Text className='text-text-primary font-semibold'>Privacy & Security</Text>
            </View>
            <Ionicons name='chevron-forward' size={20} color={"#666"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className='flex-row items-center justify-center
                    mx-3 py-5 gap-2
                    border rounded-xl border-red-500'
          activeOpacity={0.7}
          onPress={()=>handleSignOut()}
        >
            <Ionicons name='log-out-outline' size={22} color={"#EF4444"} />
            <Text className='text-red-500 font-semibold'>Sign Out</Text>
        </TouchableOpacity>
          <Text className='text-text-secondary font-semibold text-center mt-2 text-sm'>Version 1.0.0</Text>
      </ScrollView>
    </SafeScreen>
  )
}

export default ProfileScreen