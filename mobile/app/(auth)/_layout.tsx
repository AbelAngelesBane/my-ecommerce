import { Stack } from 'expo-router';

export default function AuthRoutesLayout() {
  // Remove all Clerk/Redirect logic from here!
  // This layout should ONLY define the stack for auth screens.
  return <Stack screenOptions={{ headerShown: false }} />;
}