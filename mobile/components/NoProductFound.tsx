import { View, Text, Image } from 'react-native'
import React from 'react'

const NoProductFound = () => {
  return (

    <View className='flex flex-col items-center justify-center gap-2'>
    <Image source={require("../assets/images/empty.gif")} height={32} width={32}></Image>
    <View className='flex flex-row items-center justify-center gap-0'>
    <Text className='text-teal-500 text-5xl'>OOPS!</Text>
    <Text className='text-text-primary text-lg'>No Product Found!</Text>
    </View>

    </View>
  )
}

export default NoProductFound