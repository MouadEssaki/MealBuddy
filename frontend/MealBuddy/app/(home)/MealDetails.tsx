import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { getMealPlan, deleteMealItem } from '../../database/personnalData'; // Import deleteMealItem
import { SafeAreaView } from 'react-native-safe-area-context';
import { format } from 'date-fns';

export default function MealDetails() {
    const { mealType, date } = useLocalSearchParams() as { mealType: string, date: string };
    const [loading, setLoading] = useState(true);
    const [meal, setMeal] = useState([]);
    const [error, setError] = useState<string | null>(null);
    const navigation = useNavigation();

    const fetchMealPlan = async () => {
        setLoading(true);
        try {
            const mealPlan = await getMealPlan(date);
            setMeal(mealPlan.meal[mealType] || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch meal plan each time the screen gains focus
    useFocusEffect(
        useCallback(() => {
            fetchMealPlan();
        }, [mealType, date])
    );

    const handleAddMeal = () => {
        navigation.navigate('AddMeal', { mealType, date });
    };

    const handleDelete = async (itemId: string) => {
        try {
            await deleteMealItem(date, mealType, itemId);
            fetchMealPlan(); // Refresh the meal plan after deletion
        } catch (error) {
            console.error('Failed to delete meal item:', error);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', marginTop: 20 }}>
            {loading && <Text>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {!loading && !error && (
                <View style={styles.cardContainer}>
                    <View style={styles.boxCard}>
                        <Text style={styles.title}>{mealType}</Text>
                        <Text style={styles.subtitle}>{format(new Date(date), 'dd MMMM yyyy')}</Text>
                    </View>

                    <View style={{ ...styles.boxCard, minHeight: 540, justifyContent: meal.length > 0 ? 'flex-start' : 'center' }}>
                        {meal.length > 0 ? (
                            meal.map((item, index) => (
                                <View key={index} style={styles.mealItem}>
                                    <Text style={styles.mealText}>{item.name}</Text>
                                    <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.deleteText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        ) : (
                            <View style={{ alignItems: 'center' }}>
                                <Text>It looks like you haven't eaten anything yet.</Text>
                            </View>
                        )}
                    </View>
                    <View style={{ width: "100%" }}>
                        <TouchableOpacity onPress={handleAddMeal}>
                            <Text style={styles.addButton}>Add a meal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#68AA64',
    },
    subtitle: {
        fontSize: 24,
        color: '#333',
    },
    boxCard: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        width: "100%",
        marginBottom: 10,
    },
    cardContainer: {
        flexDirection: "column",
        alignItems: "center",
        width: "90%",
        backgroundColor: '#FFF4E4',
        padding: 20,
        borderRadius: 30,
        height: "95%",
    },
    deleteText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
        fontWeight: 'bold',
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#68AA64',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 5,
    },
    mealText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#68AA64',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 20,
        width: "100%",
    },
});