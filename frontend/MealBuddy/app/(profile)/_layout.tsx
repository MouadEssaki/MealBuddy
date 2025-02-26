import { Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text } from 'react-native';

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

export default function ProfileLayout() {
    return (
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
                name="Profile"
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditGoal"
                options={{
                    headerTitle: () => <HeaderTitle title="EditGoal" />,
                }}
            />

            <Stack.Screen
                name="EditProfile"
                options={{
                    headerTitle: () => <HeaderTitle title="Edit Profile" />,
                }}
            />
        </Stack>
    );
}
