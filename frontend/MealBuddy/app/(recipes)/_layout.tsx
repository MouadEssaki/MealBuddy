import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { GlobalProvider } from './GlobalState';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
};

const HeaderTitle = ({ title }: { title: string }) => (
    <Text style={{
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.beige,
        maxWidth: 250,
    }} numberOfLines={1}>
        {title}
    </Text>
);

export default function RecipeLayout() {
    return (
        <GlobalProvider>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: COLORS.vert,
                        elevation: 0,
                        shadowColor: 'transparent',
                    },
                    headerTintColor: COLORS.beige,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    headerBackTitleVisible: false,
                    headerBackImage: () => (
                        <MaterialCommunityIcons
                            name="arrow-left"
                            size={24}
                            color={COLORS.beige}
                            style={{ marginLeft: 16 }}
                        />
                    ),
                }}
            >
                <Stack.Screen
                    name="Recipes"
                    options={{ headerShown: false }}
                />

                <Stack.Screen
                    name="RecipesDetails"
                    options={{
                        headerTitle: () => <HeaderTitle title="Recipe Details" />,
                        headerRight: () => (
                            <MaterialCommunityIcons
                                name="heart-outline"
                                size={24}
                                color={COLORS.beige}
                                style={{ marginRight: 16 }}
                            />
                        ),
                    }}
                />

                <Stack.Screen
                    name="CreateRecipe"
                    options={{
                        headerTitle: () => <HeaderTitle title="New Recipe" />,

                    }}
                />

                <Stack.Screen
                    name="AddIngredient"
                    options={{
                        headerTitle: () => <HeaderTitle title="New Recipe" />,
                    }}
                />
            </Stack>
        </GlobalProvider>
    );
}