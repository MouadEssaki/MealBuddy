import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{ headerShown: false,
                    headerTitle: 'Home'
                 }}
            />
            <Stack.Screen
                name="MealDetails"
                options={{ headerShown: true,
                    headerTitle: ''
                 }} // Hide header for MealDetails
            />
            <Stack.Screen
                name="AddMeal"
                options={{ headerShown: true,
                    headerTitle: ''
                 }} // Hide header for AddMeal
            />
        </Stack>
    );
}
