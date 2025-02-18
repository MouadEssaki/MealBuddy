
//add meal tsx

import React, { useState } from 'react';
import { Text, View, TextInput, Button, StyleSheet } from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { addMealItem } from '../../database/personnalData'; // Ajuste le chemin d'import si besoin

export default function AddMeal() {
    const { mealType, date } = useLocalSearchParams() as { mealType: string, date: string }; // Récupère mealType et date depuis les paramètres
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    const handleSubmit = async () => {
        if (!name || !calories) {
            setError('Please fill all fields');
            return;
        }
        try {
            console.log(date, mealType, name, calories);
            await addMealItem( date, mealType, { name, calories } );
            navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add a meal</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Calories"
                value={calories}
                onChangeText={setCalories}
                keyboardType="numeric"
            />
            <Button title="Add" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});