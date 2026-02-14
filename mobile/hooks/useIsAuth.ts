import { useAuth } from "@clerk/clerk-expo";
import { useRouter, } from "expo-router";
import { useEffect } from "react";

export const useAuthGuard = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;


    if (!isSignedIn) {
      // Redirect to login if they try to access protected screens
      router.replace("/(auth)");
    } 
  }, [isSignedIn, isLoaded]);

  return { isLoaded, isSignedIn };
};