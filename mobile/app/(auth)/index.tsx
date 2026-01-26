import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import useSocialAuth from "@/hooks/useSocialAuth";

const AuthScreen = () => {
  const { isLoading, handleSocialAuth } = useSocialAuth();
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image
        source={require("../../assets/images/boy-cart.png")}
        className="size-72"
        resizeMode="contain"
      />

      <View className="gap-2 mt-4">
        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6"
          onPress={() => handleSocialAuth("oauth_google")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1, //ios
            elevation: 2, // android ELEVATION
          }}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row items-center justify-center p-2">
              <Image
                source={require("../../assets/images/google.png")}
                className="size-10 mr-3"
                resizeMode="contain"
              ></Image>
              <Text className="text-black font-medium text-base">
                Continue with Google
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6"
          onPress={() => handleSocialAuth("oauth_apple")}
          disabled={isLoading}
          style={{
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1, //ios
            elevation: 2, // android ELEVATION
          }}
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <View className="flex-row items-center justify-center p-2">
              <Image
                source={require("../../assets/images/apple.png")}
                className="size-8 mr-3"
                resizeMode="contain"
              ></Image>
              <Text className="text-black font-medium text-base">
                Continue with Apple
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-center text-gray-500 text-xs leading-4 mt-6 p-2">
        By signing up, you agree to our <Text className="text-blue-500"> terms and conditions </Text>
        and <Text className="text-blue-500">Cookie Use</Text>
      </Text>
    </View>
  );
};

export default AuthScreen;
