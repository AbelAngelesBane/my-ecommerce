import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';
import LoadingPage from "@/components/LoadingPage";

// Sentry Config remains the same...
Sentry.init({
  dsn: 'https://7b0ee9fdb6ae094f342a35e6e6fd5565@o4510540054528000.ingest.us.sentry.io/4510882537340928',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration({ maskAllImages: true, maskAllText: true }), 
    Sentry.feedbackIntegration()
  ],
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: { type: "react-query-error", queryKey: query.queryKey[0]?.toString() || "unknown" },
        extra: { errorMessage: error.message, statusCode: error.response?.status, queryKey: query.queryKey }
      })
    }
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: { type: "react-query-mutation-error" },
        extra: { errorMessage: error.message, statusCode: error.response?.status }
      })
    }
  })
});

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

useEffect(() => {
  if (!isLoaded) return;

  const inAuthGroup = segments[0] === "(auth)";

  if (!isSignedIn) {

    if (!inAuthGroup) {
      router.replace("/(auth)"); 
    }
  } else if (isSignedIn && inAuthGroup) {
    router.replace("/(tabs)");
  }
}, [isSignedIn, isLoaded, segments]);


  if (!isLoaded) return <LoadingPage/>;

  return (
    <Stack initialRouteName={isSignedIn ? "(tabs)" : "(auth)"} screenOptions={{ 
      headerShown: false
       }}>
      {/* Naming these explicitly prevents the 'REPLACE not handled' error */}
      <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
    </Stack>
  );
}

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" /> 
        <InitialLayout />
      </QueryClientProvider>
    </ClerkProvider>
  );
});