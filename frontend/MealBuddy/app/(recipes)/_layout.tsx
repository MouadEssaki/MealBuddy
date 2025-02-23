import { Stack } from 'expo-router';

export default function RecipeLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="Recipes"
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="RecipesDetails"
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
            <Stack.Screen
                name="CreateRecipe"
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
