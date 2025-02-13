import React, { useCallback, useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useFocusEffect } from 'expo-router';
import { getMealPlan } from '../../database/personnalData';
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

    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
            {loading && <Text>Loading...</Text>}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            {!loading && !error && (
                <View style={styles.cardContainer}>
                    <View style={styles.boxCard}>
                        <Text style={styles.title}>{mealType}</Text>
                        <Text style={styles.subtitle}>{format(new Date(date), 'dd MMMM yyyy')}</Text>
                    </View>

                    <View style={{ ...styles.boxCard, minHeight: 500, justifyContent: meal.length > 0 ? 'flex-start' : 'center' }}>
                        {meal.length > 0 ? (
                            meal.map((item, index) => (
                                <View key={index} style={styles.mealItem}>
                                    <Text>{item.name}</Text>
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
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 6,
    },
    mealItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 5,
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
