import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import SafeScreen from './SafeScreen'

const LoadingPage = () => {
  return (
    <SafeScreen>
        <View className='flex flex-col justify-center items-center'>
            <ActivityIndicator className='size-32' color={"#EF4444"}/>
        </View>
    </SafeScreen>

  )
}

export default LoadingPage