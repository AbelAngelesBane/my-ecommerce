import { Stack } from "expo-router";
import "../global.css";
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from "expo-status-bar";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://7b0ee9fdb6ae094f342a35e6e6fd5565@o4510540054528000.ingest.us.sentry.io/4510882537340928',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  //In development 1.0, in production 0.1
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration({
    maskAllImages:true,
    maskAllText:true
  }), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});



const queryClient = new QueryClient({
  queryCache:new QueryCache({
    onError:(error:any, query)=>{
      Sentry.captureException(error,{
        tags:{
          type:"react-query-error",
          queryKey:query.queryKey[0]?.toString() || "unknown"
        },
        extra:{
          errorMessage:error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey
        }
      })
    }
  }),
  mutationCache:new MutationCache({
    onError:(error: any)=>{
      //This is a global error handler
      Sentry.captureException(error,{
        tags:{type:"react-query-mutation-error"},
        extra:{
          errorMessage:error.message,
          statusCode:error.response?.status
        }
      })
    }
  })
});

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" /> 
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </ClerkProvider>
  );
});