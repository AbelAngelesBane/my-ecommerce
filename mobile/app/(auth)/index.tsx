import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import useSocialAuth from "@/hooks/useSocialAuth";
import SafeScreen from "@/components/SafeScreen";

const AuthScreen = () => {
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();
  return (
    <SafeScreen>
      <View className="flex-1 justify-center items-center bg-white">
        <View style={{ height: 250, width: '100%', alignItems: 'center', justifyContent: 'center', flex:2 }}>
          <Image
            source={require("../../assets/images/boy-cart.png")}
            style={{
              width: '100%',
              height: '100%'
            }}
            resizeMode="contain"
          />
        </View>

        <View className="gap-2 mt-4 flex-2">
          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 h-14"
            onPress={() => handleSocialAuth("oauth_google")}
            disabled={loadingStrategy !== null}
            style={{
              elevation: 2,
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: 1 },
            }}
          >
            {loadingStrategy === "oauth_google" ? (
              <ActivityIndicator />
            ) : (
              <View className="flex-row items-center justify-center p-2">
                <Image
                  source={require("../../assets/images/google.png")}
                  style={{ width: 30, height: 30, marginRight: 12 }}
                  resizeMode="contain"
                ></Image>
                <Text className="text-black font-medium text-base">
                  Continue with Google
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center bg-white border border-gray-300 rounded-full px-6 h-14"
            onPress={() => handleSocialAuth("oauth_apple")}
            disabled={loadingStrategy !== null}
            style={{
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1, //ios
              elevation: 2, // android ELEVATION
            }}
          >
            {loadingStrategy === "oauth_apple" ? (
              <ActivityIndicator />
            ) : (
              <View className="flex-row items-center justify-center p-2">
                <Image
                  source={require("../../assets/images/apple.png")}
                  style={{ width: 30, height: 30, marginRight: 12 }}
                  resizeMode="contain"
                ></Image>
                <Text className="text-black font-medium text-base">
                  Continue with Apple
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <Text className="text-center text-gray-500 text-xs leading-4 mt-6 p-2 flex-1">
          By signing up, you agree to our <Text className="text-blue-500"> terms and conditions </Text>
          and <Text className="text-blue-500">Cookie Use</Text>
        </Text>
      </View>
    </SafeScreen>

  );
};

export default AuthScreen;
