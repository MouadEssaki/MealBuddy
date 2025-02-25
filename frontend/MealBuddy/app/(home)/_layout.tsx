import { Stack } from 'expo-router';
import { Text } from 'react-native';

const HeaderTitle = ({ title }: { title: string }) => (
    <Text style={{
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF4E4',
        fontFamily: 'System',
        marginLeft: 16
    }}>
        {title}
    </Text>
);

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#105F3B',
                    elevation: 2,
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    shadowColor: '#000',
                    shadowOffset: { height: 2, width: 0 },
                },
                headerTintColor: '#FFF4E4',
                headerTitleStyle: {
                    fontWeight: '600',
                },
                headerBackTitleVisible: false,
            }}
        >
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    headerTitle: 'Home'
                }}
            />

            <Stack.Screen
                name="MealDetails"
                options={{
                    headerTitle: () => <HeaderTitle title="Meal Details" />,
                    headerShadowVisible: true,
                }}
            />

            <Stack.Screen
                name="AddMeal"
                options={{
                    headerTitle: () => <HeaderTitle title="Log Meal" />,
                    
                }}
            />

            <Stack.Screen
                name="SelectedMeal"
                options={{
                    headerTitle: () => <HeaderTitle title="Meal Information" />,
                    headerBackTitle: 'Back',
                }}
            />
        </Stack>
    );
}