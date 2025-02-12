import React, { useEffect, useState } from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { addMealItem, deleteMealItem, getMealPlan } from '../../database/personnalData'; // Adjust the import path
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MealDetails() {
    const { mealType, date } = useLocalSearchParams(); // Get meal type from params
    const [loading, setLoading] = useState(true);
    const [meal, setMeal] = useState({});
    const [error, setError] = useState(null);

    //fet
    useEffect(() => {

        // Fetch meal data from API getMealPlan date
        const currentMeal = getMealPlan(date);
        console.log(currentMeal);
    }, [mealType]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>{mealType}</Text>
                <Image source={meal.image} style={styles.image} />
                <Text style={styles.description}>{meal.description}</Text>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#68AA64',
    },
    image: {
        width: 100,
        height: 100,
        marginVertical: 20,
    },
    description: {
        fontSize: 18,
        textAlign: 'center',
        color: '#333',
    },
});
