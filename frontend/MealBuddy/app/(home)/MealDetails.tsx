import React, { useCallback, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { getMealPlan, deleteMealItem } from '../../database/personnalData';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
    vertClaire: '#68AA64',
    vert: '#105F3B',
    orange: '#E36820',
    beige: '#FFF4E4',
    white: '#FFFFFF',
    background: '#F9F9F9'
};

export default function MealDetails() {
    const { mealType, date } = useLocalSearchParams() as { mealType: string, date: string };
    const [loading, setLoading] = useState(true);
    const [meal, setMeal] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();
    const [refreshKey, setRefreshKey] = useState(0); // Add refresh state

    const fetchMealPlan = async () => {
        setLoading(true);
        try {
            const mealPlan = await getMealPlan(date);
            setMeal(mealPlan.meal[mealType] || []);
            console.log(mealPlan.meal[mealType]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // In your parent component (e.g., food diary screen)
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                console.log('Refreshing data...');
                await fetchMealPlan();
            };
            fetchData();
        }, [refreshKey]) // Add dependency here
    );

    const handleAddMeal = () => navigation.navigate('AddMeal', { mealType, date });
    const handleDelete = async (itemId: string) => {
        try {
            await deleteMealItem(date, mealType, itemId);
            fetchMealPlan();
        } catch (error) {
            console.error('Failed to delete meal item:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[COLORS.vert, '#1a7a4e']}
                style={styles.header}
            >
                <Text style={styles.headerTitle}>{mealType}</Text>
                <Text style={styles.dateText}>{format(new Date(date), 'EEEE, MMMM do')}</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.vert} />
                    </View>
                ) : error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : (
                    <View style={styles.mealList}>
                        {meal.length > 0 ? (
                            meal.map((item, index) => (
                                <View key={index} style={styles.mealCard}>
                                    <View style={styles.mealInfo}>
                                        <Text style={styles.mealName}>{item.name}</Text>
                                        <Text style={styles.mealDetails}>{item.nutritional_info.calories} kcal • {item.quantity_measurement}</Text>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.id)}
                                        style={styles.deleteButton}
                                    >
                                        <Icon name="trash-can-outline" size={20} color={COLORS.orange} />
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                {/* <Image
                                    source={require('../../assets/empty-plate.png')} // Add your empty state image
                                    style={styles.emptyImage}
                                /> */}
                                <Text style={styles.emptyTitle}>No Items Added</Text>
                                <Text style={styles.emptyText}>Start by adding your first meal item</Text>
                            </View>
                        )}
                    </View>
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddMeal}
                >
                    <LinearGradient
                        colors={[COLORS.orange, '#f05a1a']}
                        style={styles.gradientButton}
                    >
                        <Icon name="plus" size={24} color={COLORS.white} />
                        <Text style={styles.buttonText}>Add Meal Item</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingVertical: 30,
        paddingHorizontal: 24,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: COLORS.white,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 18,
        color: COLORS.beige,
        opacity: 0.9,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingTop: 30,
        paddingBottom: 40,
    },
    mealList: {
        marginBottom: 30,
    },
    mealCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 15,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    mealInfo: {
        flex: 1,
        marginRight: 15,
    },
    mealName: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.vert,
        marginBottom: 4,
    },
    mealDetails: {
        fontSize: 14,
        color: '#666',
    },
    deleteButton: {
        padding: 10,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: COLORS.vert,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    addButton: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: COLORS.orange,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    gradientButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    errorText: {
        color: COLORS.orange,
        fontSize: 16,
        textAlign: 'center',
        marginVertical: 30,
    },
});