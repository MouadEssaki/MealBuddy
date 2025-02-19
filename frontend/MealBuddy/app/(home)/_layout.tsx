import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="MealDetails"
                options={{
                    headerShown: true,
                    // This property removes the bottom border/shadow in React Navigation 6+
                    headerShadowVisible: false,
                    headerStyle: {
                        // Also set these to ensure no elevation/shadow on Android
                        elevation: 0,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                        backgroundColor: '#fff', // or whatever your header color is
                    },
                }}
            />
            <Stack.Screen
                name="AddMeal"
                options={{
                    headerShown: true,
                    headerShadowVisible: false,
                    headerStyle: {
                        elevation: 0,
                        shadowColor: 'transparent',
                        borderBottomWidth: 0,
                        backgroundColor: '#fff',
                    },
                }}
            />
        </Stack>
    );
}
